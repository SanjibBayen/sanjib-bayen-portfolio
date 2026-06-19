/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Stateful Rate Limiter
 */

import { CONFIG } from "../config";
import { SecurityLogger } from "../utils/logger";
import { SecurityUtils } from "../utils/security.utils";

import { Request, Response, NextFunction } from "express";

export class RateLimiter {
  private store: Map<
    string,
    { count: number; resetTime: number; blockedUntil?: number }
  > = new Map();
  private blockedIPs: Map<string, number> = new Map();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.cleanupInterval = setInterval(
      () => this.cleanup(),
      CONFIG.SECURITY.rateLimit.cleanupInterval,
    );
  }

  async consume(key: string, maxRequests: number, windowMs: number) {
    const now = Date.now();

    if (key.includes("127.0.0.1") || key.includes("::1")) {
      return {
        allowed: true,
        remaining: maxRequests,
        resetTime: now + windowMs,
      };
    }

    const blockExpiry = this.blockedIPs.get(key);
    if (blockExpiry && now < blockExpiry) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: blockExpiry,
        blockedUntil: blockExpiry,
      };
    }
    if (blockExpiry && now >= blockExpiry) {
      this.blockedIPs.delete(key);
    }

    const record = this.store.get(key);
    if (!record || now > record.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + windowMs });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      };
    }

    if (record.count >= maxRequests) {
      if (record.count >= maxRequests * 3) {
        const blockUntil = now + CONFIG.SECURITY.contactRateLimit.blockDuration;
        this.blockedIPs.set(key, blockUntil);
        SecurityLogger.log("ip_blocked", { key, blockUntil }, "warn");
        return {
          allowed: false,
          remaining: 0,
          resetTime: blockUntil,
          blockedUntil: blockUntil,
        };
      }
      return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    record.count++;
    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetTime: record.resetTime,
    };
  }

  blockIP(key: string, duration: number) {
    this.blockedIPs.set(key, Date.now() + duration);
  }

  private cleanup() {
    const now = Date.now();

    if (this.store.size > 10000) {
      const entries = Array.from(this.store.entries());
      entries.sort((a, b) => a[1].resetTime - b[1].resetTime);
      for (let i = 0; i < entries.length / 2; i++) {
        this.store.delete(entries[i][0]);
      }
      SecurityLogger.log(
        "rate_limiter_memory_cleanup",
        { cleared: entries.length / 2 },
        "warn",
      );
    }

    for (const [key, value] of this.store.entries()) {
      if (now > value.resetTime && !this.blockedIPs.has(key)) {
        this.store.delete(key);
      }
    }
    for (const [key, expiry] of this.blockedIPs.entries()) {
      if (now > expiry) this.blockedIPs.delete(key);
    }
  }

  destroy() {
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
    this.store.clear();
    this.blockedIPs.clear();
  }
}

export const rateLimiter = new RateLimiter();

export async function generalRateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith("/assets/") || req.path.includes(".")) return next();
  const ip = SecurityUtils.hashIP(req.ip || "unknown");
  const result = await rateLimiter.consume(
    ip,
    CONFIG.SECURITY.rateLimit.maxRequests,
    CONFIG.SECURITY.rateLimit.windowMs,
  );
  res.setHeader("X-RateLimit-Limit", CONFIG.SECURITY.rateLimit.maxRequests);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, result.remaining));
  if (!result.allowed) {
    return res.status(429).json({
      success: false,
      error: "Too many requests",
      retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
    });
  }
  next();
}
