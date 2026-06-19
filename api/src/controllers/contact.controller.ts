/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Contact Controller
 */

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CONFIG } from "../config";
import { rateLimiter } from "../middleware/rateLimiter";
import { performGeoipLookup } from "../middleware/geo";
import { SecurityUtils } from "../utils/security.utils";
import { SpamDetector } from "../utils/spamDetector";
import { emailService } from "../services/email.service";

export async function submitContactForm(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        error: "Validation Error",
        errors: errors.array(),
      });
    }

    const contactIp = SecurityUtils.hashIP(req.ip || "unknown");
    const contactResult = await rateLimiter.consume(
      `contact:${contactIp}`,
      CONFIG.SECURITY.contactRateLimit.maxRequests,
      CONFIG.SECURITY.contactRateLimit.windowMs,
    );
    if (!contactResult.allowed) {
      return res
        .status(429)
        .json({ success: false, error: "Too many submissions" });
    }

    const spamResult = SpamDetector.calculateScore({
      subject: req.body.subject,
      message: req.body.message,
      senderEmail: req.body.senderEmail,
      senderName: req.body.senderName,
    });
    if (spamResult.score > 0.7) {
      return res
        .status(400)
        .json({ success: false, error: "Message flagged as spam" });
    }

    const trackingId = SecurityUtils.generateTrackingId();
    const timestamp = new Date().toISOString();
    const geoLocation =
      res.locals.geo || performGeoipLookup(req.ip || "", req);

    await Promise.allSettled([
      emailService.sendOwnerNotification({
        senderName: req.body.senderName,
        senderEmail: req.body.senderEmail,
        senderPhone: req.body.senderPhone,
        subject: req.body.subject || "General Inquiry",
        message: req.body.message,
        trackingId,
        timestamp,
        metadata: {
          geoLocation,
          browser: (req as any).useragent?.browser || "Unknown",
          os: (req as any).useragent?.os || "Unknown",
        },
      }),
      emailService.sendAutoReply({
        senderName: req.body.senderName,
        senderEmail: req.body.senderEmail,
        trackingId,
        timestamp,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Message sent!",
      data: { trackingId, timestamp },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
}
