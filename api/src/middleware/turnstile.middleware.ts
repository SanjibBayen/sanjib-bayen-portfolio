/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Centralized Turnstile & Rate Limiter Middleware
 */

import { Request, Response, NextFunction } from "express";
import { CONFIG } from "../config";
import { SecurityUtils } from "../utils/security.utils";
import { SecurityLogger } from "../utils/logger";
import { rateLimiter } from "./rateLimiter";

/**
 * Validates the cf_verified cookie to protect API routes requiring security clearance.
 */
export function turnstileCookieMiddleware(req: Request, res: Response, next: NextFunction) {
  const skipPaths = [
    "/api/v1/turnstile-verify",
    "/api/csrf-token",
    "/api/v1/security-analytics",
    "/api/v1/ip-info",
    "/favicon.ico",
  ];

  if (skipPaths.includes(req.path) || req.path.startsWith("/assets/")) {
    return next();
  }

  const host = (req.headers.host || "").toLowerCase();
  const ip = req.ip || "";
  
  // Localhost sandbox skips Turnstile checking
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    host.includes("localhost") ||
    host.includes(".run.app") ||
    host.includes(".googleusercontent.com")
  ) {
    return next();
  }

  const turnstileToken = req.cookies?.cf_verified;
  if (!turnstileToken) {
    if (req.path.startsWith("/api/")) {
      SecurityLogger.log(
        "verification_cookie_missing",
        { path: req.path, ip: SecurityUtils.hashIP(ip) },
        "warn"
      );
      return res.status(403).json({
        success: false,
        error: "VERIFICATION_REQUIRED",
        message: "Please complete the security check first",
      });
    }
    return next();
  }

  const hashedIP = SecurityUtils.hashIP(ip);
  const isValid = SecurityUtils.verifyTurnstileVerificationToken(turnstileToken, hashedIP);

  if (!isValid) {
    SecurityLogger.log(
      "verification_cookie_invalid",
      { path: req.path, ip: hashedIP },
      "error"
    );
    res.clearCookie("cf_verified");
    res.clearCookie("cf_verified_time");
    
    if (req.path.startsWith("/api/")) {
      return res.status(403).json({
        success: false,
        error: "VERIFICATION_EXPIRED",
        message: "Your security session has expired. Please verify again.",
      });
    }
  }

  next();
}

/**
 * Express middleware to enforce rate-limiting on the Turnstile verification endpoint (max 10 attempts/min).
 */
export async function turnstileRateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    const ip = req.ip || "unknown";
    const recordKey = `turnstile-verify:${SecurityUtils.hashIP(ip)}`;
    
    // Limits Turnstile verification attempts to 10 per minute (60000ms window)
    const result = await rateLimiter.consume(recordKey, 10, 60000);
    
    if (!result.allowed) {
      SecurityLogger.log(
        "turnstile_rate_limit_exceeded",
        {
          ip: SecurityUtils.hashIP(ip),
          blockedUntil: result.blockedUntil,
        },
        "critical"
      );
      
      return res.status(429).json({
        success: false,
        error: "Too many verification attempts. Please wait before retrying.",
        retryAfter: result.blockedUntil
          ? Math.ceil((result.blockedUntil - Date.now()) / 1000)
          : 60,
      });
    }
    
    next();
  } catch (error) {
    SecurityLogger.log(
      "rate_limiter_middleware_error",
      { error: String(error) },
      "error"
    );
    // Graceful error handling: pass through to avoid locking out legitimate users
    next();
  }
}
