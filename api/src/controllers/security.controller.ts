/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Security Controller
 */

import { Request, Response } from "express";
import { CONFIG } from "../config";
import { rateLimiter } from "../middleware/rateLimiter";
import { SecurityUtils } from "../utils/security.utils";
import { SecurityLogger } from "../utils/logger";
import { TurnstileVerifier } from "../services/turnstile.service";

export async function verifyTurnstile(req: Request, res: Response) {
  try {
    const { turnstileToken } = req.body;
    const ip = req.ip || "";
    if (!turnstileToken) {
      return res
        .status(400)
        .json({ success: false, error: "Missing Turnstile token" });
    }

    const verifyKey = `turnstile-verify:${SecurityUtils.hashIP(ip)}`;
    const rateResult = await rateLimiter.consume(verifyKey, 10, 60000);
    if (!rateResult.allowed) {
      return res
        .status(429)
        .json({ success: false, error: "Too many verification attempts" });
    }

    const verification = await TurnstileVerifier.verify(turnstileToken, ip);
    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: verification.error || "Verification failed",
      });
    }

    const verificationToken = SecurityUtils.generateTurnstileVerificationToken(
      SecurityUtils.hashIP(ip),
    );
    const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";
    res.cookie("cf_verified", verificationToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? "none" : "lax",
      maxAge: CONFIG.SECURITY.turnstileVerificationMaxAge,
      path: "/",
    });
    res.cookie("cf_verified_time", Date.now().toString(), {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? "none" : "lax",
      maxAge: CONFIG.SECURITY.turnstileVerificationMaxAge,
      path: "/",
    });

    SecurityLogger.log("turnstile_verification_complete", {
      ip: SecurityUtils.hashIP(ip),
    });
    return res
      .status(200)
      .json({ success: true, message: "Verification successful" });
  } catch (error) {
    SecurityLogger.log(
      "turnstile_verification_error",
      { error: String(error) },
      "error",
    );
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}

export function submitSecurityAnalytics(req: Request, res: Response) {
  return res.status(200).json({ success: true });
}

export function getCsrfToken(req: Request, res: Response) {
  return res.json({
    success: true,
    csrfToken: res.locals.csrfToken,
    requestId: res.locals.requestId,
  });
}

export function getIpInfo(req: Request, res: Response) {
  return res.json({
    success: true,
    data: {
      ip: req.ip || "unknown",
      hashedIp: SecurityUtils.hashIP(req.ip || "unknown"),
    },
    requestId: res.locals.requestId,
  });
}
