/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - CSRF Protection Middleware
 */

import { Request, Response, NextFunction } from "express";
import { CONFIG } from "../config";
import { SecurityLogger } from "../utils/logger";
import { SecurityUtils } from "../utils/security.utils";

export class CSRFProtection {
  static validateToken(req: Request, res: Response, next: NextFunction) {
    if (req.method === "GET") return next();

    const cookieToken = req.cookies?.[CONFIG.SECURITY.csrfCookieName];
    const headerToken = req.headers["x-csrf-token"] || req.body?.csrfToken;

    if (!cookieToken || !headerToken) {
      SecurityLogger.log(
        "csrf_missing",
        { ip: SecurityUtils.hashIP(req.ip || ""), path: req.path },
        "warn",
      );
      return res.status(403).json({
        success: false,
        error: "CSRF token missing",
        requestId: res.locals.requestId,
      });
    }

    if (cookieToken.length !== String(headerToken).length) {
      return res.status(403).json({
        success: false,
        error: "Invalid CSRF token",
        requestId: res.locals.requestId,
      });
    }

    let valid = true;
    const headerBuf = Buffer.from(String(headerToken));
    const cookieBuf = Buffer.from(cookieToken);
    for (let i = 0; i < cookieBuf.length; i++) {
      if (cookieBuf[i] !== headerBuf[i]) valid = false;
    }

    if (!valid) {
      SecurityLogger.log(
        "csrf_invalid",
        { ip: SecurityUtils.hashIP(req.ip || ""), path: req.path },
        "warn",
      );
      return res.status(403).json({
        success: false,
        error: "Invalid CSRF token",
        requestId: res.locals.requestId,
      });
    }

    next();
  }
}
