/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Contact Validation Rules
 */

import { body } from "express-validator";

export const contactValidationRules = [
  body("senderName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z\s\-'\.]+$/),
  body("senderEmail").trim().isEmail().normalizeEmail(),
  body("subject").optional().trim().isLength({ max: 200 }),
  body("message").trim().isLength({ min: 10, max: 5000 }),
  body("senderPhone")
    .optional()
    .trim()
    .matches(/^[+\d\s\-\(\)]{7,20}$/),
];
