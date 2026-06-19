/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Security Validators
 */

import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { SecurityLogger } from "../utils/logger";
import { SecurityUtils } from "../utils/security.utils";

/**
 * Validates request payload for Turnstile verification endpoint (verifyTurnstile).
 */
export const turnstileVerificationRules = [
  body("turnstileToken")
    .trim()
    .notEmpty()
    .withMessage("Token is required")
    .isLength({ min: 10, max: 2048 })
    .withMessage("Invalid token length/payload specification")
    // Sanitize to prevent basic execution strings injection
    .customSanitizer(val => SecurityUtils.sanitizeHtml(val)),
];

/**
 * Middleware wrapper to assert validation rules and return errors formatted cleanly.
 */
export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(err => ({ field: err.type, message: err.msg }));
    
    SecurityLogger.log(
      "validation_failed",
      {
        path: req.path,
        errors: errorDetails,
        ip: SecurityUtils.hashIP(req.ip || ""),
      },
      "warn"
    );

    return res.status(400).json({
      success: false,
      error: "Validation Failed",
      details: errorDetails,
    });
  }
  next();
}
