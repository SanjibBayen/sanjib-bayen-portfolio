/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Intrusion Detection System (IDS)
 */

import { Request, Response, NextFunction } from "express";
import { rateLimiter } from "./rateLimiter";
import { SecurityLogger } from "../utils/logger";
import { SecurityUtils } from "../utils/security.utils";

export class IntrusionDetector {
  private static attackPatterns = [
    {
      pattern: /(\b(SELECT.*FROM|INSERT.*INTO|DELETE.*FROM|DROP TABLE|UNION SELECT)\b)/i,
      type: "sql_injection",
      severity: "critical",
      checkBody: true,
    },
    {
      pattern: /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      type: "xss",
      severity: "critical",
      checkBody: true,
    },
    {
      pattern: /javascript:/gi,
      type: "xss",
      severity: "critical",
      checkBody: true,
    },
    {
      pattern: /\.\.\/\.\.\/\.\.\//,
      type: "path_traversal",
      severity: "critical",
    },
    {
      pattern: /\/etc\/passwd|\/etc\/shadow/,
      type: "system_file_access",
      severity: "critical",
    },
    {
      pattern: /\.env$|\.git|\.svn|\.hg|\.DS_Store/i,
      type: "sensitive_file",
      severity: "critical",
    },
    {
      pattern: /nikto|nessus|nmap|sqlmap|acunetix|burpsuite/i,
      type: "vulnerability_scanner",
      severity: "critical",
    },
  ];

  static detect(req: Request): {
    detected: boolean;
    type?: string;
    severity?: string;
  } {
    const url = decodeURIComponent(req.url).toLowerCase();
    for (const { pattern, type, severity, checkBody } of this.attackPatterns) {
      if (pattern.test(url)) return { detected: true, type, severity };
      if (checkBody && req.method === "POST" && req.body) {
        if (pattern.test(JSON.stringify(req.body).toLowerCase())) {
          return { detected: true, type, severity };
        }
      }
    }
    return { detected: false };
  }
}

export function idsMiddleware(req: Request, res: Response, next: NextFunction) {
  const result = IntrusionDetector.detect(req);
  if (result.detected) {
    SecurityLogger.log(
      "intrusion_detected",
      { type: result.type },
      result.severity === "critical" ? "critical" : "warn",
    );
    if (result.severity === "critical") {
      rateLimiter.blockIP(SecurityUtils.hashIP(req.ip || ""), 3600000);
    }
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}
