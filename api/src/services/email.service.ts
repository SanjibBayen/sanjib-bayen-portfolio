/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Email Service
 */

import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import { CONFIG } from "../config";
import { SecurityLogger } from "../utils/logger";
import { EmailTemplates } from "./emailTemplates";

export class EmailService {
  private resend: Resend;
  private static instance: EmailService;

  private constructor() {
    this.resend = new Resend(CONFIG.RESEND.apiKey);
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) EmailService.instance = new EmailService();
    return EmailService.instance;
  }

  async sendOwnerNotification(data: any) {
    try {
      const templates = EmailTemplates.ownerNotification(data);
      if (!CONFIG.RESEND.apiKey) {
        console.log(
          "📨 [SIMULATED] Owner notification to:",
          CONFIG.OWNER.email,
        );
        return { success: true, id: `simulated-${uuidv4()}` };
      }
      const { data: result, error } = await this.resend.emails.send({
        from: `${CONFIG.RESEND.fromName} <${CONFIG.RESEND.fromEmail}>`,
        to: [CONFIG.OWNER.email],
        replyTo: data.senderEmail,
        subject: `[${data.trackingId}] New Contact: ${data.subject}`,
        html: templates.html,
        text: templates.text,
        headers: { "X-Tracking-ID": data.trackingId, "X-Priority": "High" },
      });
      if (error) {
        SecurityLogger.log(
          "email_owner_failed",
          { error: error.message },
          "error",
        );
        return { success: false, error: error.message };
      }
      return { success: true, id: result?.id };
    } catch (error) {
      SecurityLogger.log(
        "email_owner_error",
        { error: String(error) },
        "error",
      );
      return { success: false, error: "Failed to send email" };
    }
  }

  async sendAutoReply(data: any) {
    try {
      const templates = EmailTemplates.senderAutoReply(data);
      if (!CONFIG.RESEND.apiKey) {
        console.log("📨 [SIMULATED] Auto-reply to:", data.senderEmail);
        return { success: true, id: `simulated-${uuidv4()}` };
      }
      const { data: result, error } = await this.resend.emails.send({
        from: `${CONFIG.OWNER.name} <${CONFIG.RESEND.fromEmail}>`,
        to: [data.senderEmail],
        subject: `✓ Message Received - ${CONFIG.OWNER.name}`,
        html: templates.html,
        text: templates.text,
        headers: {
          "X-Tracking-ID": data.trackingId,
          "X-Auto-Response-Suppress": "All",
        },
      });
      if (error) {
        const isSandbox =
          error.message.includes("testing emails") ||
          error.message.includes("verify a domain") ||
          CONFIG.RESEND.fromEmail === "onboarding@resend.dev";
        if (isSandbox) {
          SecurityLogger.log(
            "email_autoreply_simulated",
            { trackingId: data.trackingId },
            "info",
          );
          return { success: true, id: `simulated-sandbox-${uuidv4()}` };
        }
        SecurityLogger.log(
          "email_autoreply_failed",
          { error: error.message },
          "error",
        );
        return { success: false, error: error.message };
      }
      return { success: true, id: result?.id };
    } catch (error) {
      SecurityLogger.log(
        "email_autoreply_error",
        { error: String(error) },
        "error",
      );
      return { success: false, error: "Failed to send auto-reply" };
    }
  }
}
export const emailService = EmailService.getInstance();
