/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Security Headers Middleware
 */

import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { CONFIG } from "../config";
import { SecurityUtils } from "../utils/security.utils";

export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  const nonce = SecurityUtils.generateNonce();
  const csrfToken = SecurityUtils.generateCSRFToken();
  const requestId = uuidv4();
  
  res.locals.nonce = nonce;
  res.locals.csrfToken = csrfToken;
  res.locals.requestId = requestId;
  
  res.setHeader("X-Request-ID", requestId);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
  );

  if (!CONFIG.IS_PRODUCTION) {
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  } else {
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  }

  res.removeHeader("X-Powered-By");
  res.removeHeader("Server");

  const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";

  res.cookie(CONFIG.SECURITY.csrfCookieName, csrfToken, {
    httpOnly: false,
    secure: isSecure,
    sameSite: isSecure ? "none" : "lax",
    maxAge: CONFIG.SECURITY.sessionMaxAge,
    path: "/",
  });

  next();
}

export function fingerprintMiddleware(req: Request, res: Response, next: NextFunction) {
  const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";
  res.cookie(
    CONFIG.SECURITY.fingerprintCookieName,
    SecurityUtils.generateFingerprint(req),
    {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? "none" : "lax",
      maxAge: CONFIG.SECURITY.fingerprintMaxAge,
      path: "/",
    }
  );
  next();
}

export function requestSizeMiddleware(req: Request, res: Response, next: NextFunction) {
  const maxSize =
    CONFIG.SECURITY.requestSizes[req.path] || CONFIG.SECURITY.requestSizes.default;
  if (parseInt(req.headers["content-length"] || "0") > maxSize) {
    return res.status(413).json({ error: "Request entity too large" });
  }
  if (req.url.length > CONFIG.SECURITY.maxUrlLength) {
    return res.status(414).json({ error: "URL too long" });
  }
  next();
}
