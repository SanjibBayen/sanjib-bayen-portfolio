/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Cloudflare Turnstile Validation Service
 */

import { CONFIG } from "../config";
import { SecurityLogger } from "../utils/logger";
import { SecurityUtils } from "../utils/security.utils";

export class TurnstileVerifier {
  static async verify(
    token: string,
    ip: string,
  ): Promise<{ success: boolean; error?: string }> {
    if (!token || token.length > 2048) {
      return { success: false, error: "Invalid token" };
    }

    if (!CONFIG.TURNSTILE.secretKey || CONFIG.TURNSTILE.secretKey === "") {
      if (CONFIG.IS_PRODUCTION) {
        SecurityLogger.log("turnstile_not_configured", {}, "critical");
        return { success: false, error: "Security verification unavailable" };
      }
      console.warn(
        "⚠️ Turnstile secret key not configured. Bypassing in development.",
      );
      return { success: true };
    }

    for (let attempt = 0; attempt <= CONFIG.TURNSTILE.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          CONFIG.TURNSTILE.timeout,
        );

        const response = await fetch(CONFIG.TURNSTILE.verificationURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: CONFIG.TURNSTILE.secretKey,
            response: token,
            remoteip: ip,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        if (data.success) {
          SecurityLogger.log("turnstile_verified", {
            ip: SecurityUtils.hashIP(ip),
          });
          return { success: true };
        }

        const errorCodes = data["error-codes"] || [];
        SecurityLogger.log(
          "turnstile_failed",
          { ip: SecurityUtils.hashIP(ip), errorCodes },
          "warn",
        );

        if (errorCodes.includes("invalid-input-response")) {
          return { success: false, error: "Invalid token" };
        }
        if (errorCodes.includes("timeout-or-duplicate")) {
          return { success: false, error: "Token expired or duplicate" };
        }
        if (attempt === CONFIG.TURNSTILE.retries) {
          return { success: false, error: "Verification failed" };
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt)),
        );
      } catch (error) {
        if (attempt === CONFIG.TURNSTILE.retries) {
          SecurityLogger.log(
            "turnstile_error",
            { error: String(error), ip: SecurityUtils.hashIP(ip) },
            "error",
          );
          return { success: false, error: "Verification service unavailable" };
        }
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt)),
        );
      }
    }

    return { success: false, error: "Max retries exceeded" };
  }
}
export const turnstileVerifier = new TurnstileVerifier();
