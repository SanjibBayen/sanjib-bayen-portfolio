/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Security Logger Utility
 */

import { CONFIG } from "../config";

export class SecurityLogger {
  private static events: Array<{
    timestamp: string;
    event: string;
    severity: string;
    data: any;
  }> = [];
  private static readonly MAX_BUFFER = 100;

  static log(
    event: string,
    data: any,
    severity: "info" | "warn" | "error" | "critical" = "info",
  ) {
    const entry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      environment: CONFIG.NODE_ENV,
      ...data,
    };

    this.events.push(entry);
    if (this.events.length > this.MAX_BUFFER) {
      this.events.shift();
    }

    const prefix = { info: "📝", warn: "⚠️", event: "📝", error: "❌", critical: "🚨" }[
      severity
    ] || "📝";

    if (CONFIG.IS_PRODUCTION && severity === "info") return;

    console.log(`${prefix} [SECURITY] ${JSON.stringify(entry)}`);

    if (severity === "critical") {
      console.error(`🚨 CRITICAL SECURITY EVENT: ${entry.event}`);
    }
  }
}
