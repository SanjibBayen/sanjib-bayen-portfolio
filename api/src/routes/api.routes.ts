/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - API Routes
 */

import { Router } from "express";
import { CSRFProtection } from "../middleware/csrf";
import {
  turnstileCookieMiddleware,
  turnstileRateLimiter,
} from "../middleware/turnstile.middleware";
import { contactValidationRules } from "../validators/contact.validator";
import { submitContactForm } from "../controllers/contact.controller";
import {
  turnstileVerificationRules,
  validateRequest,
} from "../validators/security.validator";
import {
  verifyTurnstile,
  submitSecurityAnalytics,
  getCsrfToken,
  getIpInfo,
} from "../controllers/security.controller";

const router = Router();

// ============================================
// Exempt Routes (Runs BEFORE CSRF validation and Turnstile Verification)
// ============================================
router.post("/v1/security-analytics", submitSecurityAnalytics);

// Protected by Turnstile rate limiters and strict express-validator sanitizers
router.post(
  "/v1/turnstile-verify",
  turnstileRateLimiter,
  turnstileVerificationRules,
  validateRequest,
  verifyTurnstile
);

router.get("/csrf-token", getCsrfToken);
router.get("/v1/ip-info", getIpInfo);

// ============================================
// CSRF & Turnstile cookie validation (Applied only for remaining API endpoints)
// ============================================
router.use(CSRFProtection.validateToken);
router.use(turnstileCookieMiddleware);

// ============================================
// Protected API routes
// ============================================
router.post("/v1/contact", contactValidationRules, submitContactForm);

export default router;
