/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Security Utilities
 */

import crypto from "crypto";
import { Request } from "express";
import { CONFIG } from "../config";

export class SecurityUtils {
  static generateNonce(): string {
    return crypto.randomBytes(16).toString("base64");
  }

  static generateCSRFToken(): string {
    return crypto.randomBytes(CONFIG.SECURITY.csrfTokenLength).toString("hex");
  }

  static hashIP(ip: string): string {
    return crypto
      .createHash("sha256")
      .update(ip + CONFIG.SECURITY.sessionSecret)
      .digest("hex")
      .substring(0, 16);
  }

  static generateTrackingId(): string {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(6).toString("hex");
    const checksum = crypto
      .createHash("sha256")
      .update(`${timestamp}${random}${CONFIG.SECURITY.sessionSecret}`)
      .digest("hex")
      .substring(0, 4);
    return `MSG-${timestamp}-${random}-${checksum}`.toUpperCase();
  }

  static sanitizeHtml(text: string): string {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;",
    };
    return text.replace(/[&<>"'/`=]/g, (char) => entities[char] || char);
  }

  static isBot(userAgent: string): boolean {
    const maliciousBots = [
      /^$/,
      /sqlmap/i,
      /nikto/i,
      /nessus/i,
      /acunetix/i,
      /burpsuite/i,
      /masscan/i,
      /zgrab/i,
      /gobuster/i,
      /dirbuster/i,
      /wpscan/i,
      /blackwidow/i,
    ];
    const benignBots = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
      /facebot/i,
      /twitterbot/i,
    ];
    if (benignBots.some((p) => p.test(userAgent))) return false;
    return maliciousBots.some((p) => p.test(userAgent));
  }

  static generateFingerprint(req: Request): string {
    const components = [
      req.ip,
      req.headers["user-agent"] || "",
      req.headers["accept-language"] || "",
      req.headers["accept-encoding"] || "",
    ].join("|");
    return crypto
      .createHash("sha256")
      .update(components)
      .digest("hex")
      .substring(0, 32);
  }

  static generateTurnstileVerificationToken(ip: string): string {
    const payload = `${ip}:${Date.now()}:${crypto.randomBytes(8).toString("hex")}`;
    const hmac = crypto
      .createHmac("sha256", CONFIG.SECURITY.sessionSecret)
      .update(payload)
      .digest("hex");
    return `${Buffer.from(payload).toString("base64")}.${hmac}`;
  }

  static verifyTurnstileVerificationToken(token: string, ip: string): boolean {
    try {
      const [payload, hmac] = token.split(".");
      const decodedPayload = Buffer.from(payload, "base64").toString();
      const expectedHmac = crypto
        .createHmac("sha256", CONFIG.SECURITY.sessionSecret)
        .update(decodedPayload)
        .digest("hex");

      if (hmac !== expectedHmac) return false;

      const [tokenIP, timestamp] = decodedPayload.split(":");
      if (tokenIP !== ip) return false;

      const age = Date.now() - parseInt(timestamp);
      return age < CONFIG.SECURITY.turnstileVerificationMaxAge;
    } catch {
      return false;
    }
  }
}
