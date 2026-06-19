/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Email Templates
 */

import { CONFIG } from "../config";
import { SecurityUtils } from "../utils/security.utils";

export class EmailTemplates {
  static ownerNotification(data: any): { html: string; text: string } {
    const formattedDate = new Date(data.timestamp).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
    const geoLocation = data.metadata.geoLocation
      ? `${data.metadata.geoLocation.city || "Unknown"}, ${data.metadata.geoLocation.country || "Unknown"}`
      : "Not available";
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#f4f6f9;font-family:sans-serif;"><table width="100%" style="max-width:600px;margin:30px auto;background:#fff;border-radius:16px;"><tr><td style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:35px 40px;text-align:center;"><h1 style="color:#fff;font-size:24px;">📬 New Message</h1><p style="color:#94a3b8;font-size:13px;">${formattedDate}</p></td></tr><tr><td style="padding:20px 40px;background:#f8fafc;"><p style="font-size:12px;color:#64748b;">Reference: <strong>${data.trackingId}</strong></p></td></tr><tr><td style="padding:30px 40px;"><h2 style="font-size:14px;">From: ${SecurityUtils.sanitizeHtml(data.senderName)}</h2><p style="color:#64748b;">Email: ${SecurityUtils.sanitizeHtml(data.senderEmail)}</p>${data.senderPhone ? `<p style="color:#64748b;">Phone: ${SecurityUtils.sanitizeHtml(data.senderPhone)}</p>` : ""}<p style="color:#64748b;">Subject: ${SecurityUtils.sanitizeHtml(data.subject)}</p><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;"><p style="color:#334155;font-size:15px;">${SecurityUtils.sanitizeHtml(data.message)}</p></div></td></tr><tr><td style="padding:20px 40px;background:#f8fafc;"><p style="font-size:11px;color:#94a3b8;">📍 ${geoLocation} | 🖥 ${data.metadata.browser || "Unknown"} / ${data.metadata.os || "Unknown"}</p></td></tr><tr><td style="background:#0f172a;padding:20px 40px;text-align:center;"><p style="color:#64748b;font-size:11px;">${CONFIG.OWNER.company} • Ref: ${data.trackingId}</p></td></tr></table></body></html>`;
    const text = `NEW CONTACT FORM SUBMISSION\n============================\nDate: ${formattedDate}\nRef: ${data.trackingId}\n\nFROM\nName: ${data.senderName}\nEmail: ${data.senderEmail}\n${data.senderPhone ? `Phone: ${data.senderPhone}\n` : ""}Subject: ${data.subject}\n\nMESSAGE:\n${data.message}\n\nLOCATION: ${geoLocation}\nBROWSER: ${data.metadata.browser || "Unknown"}`;
    return { html, text };
  }

  static senderAutoReply(data: any): { html: string; text: string } {
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#f0f9ff;font-family:sans-serif;"><table width="100%" style="max-width:560px;margin:30px auto;background:#fff;border-radius:16px;"><tr><td style="background:linear-gradient(135deg,#059669,#047857);padding:40px;text-align:center;"><h1 style="color:#fff;font-size:26px;">✓ Message Received!</h1><p style="color:#a7f3d0;">Thank you for reaching out</p></td></tr><tr><td style="padding:35px 40px;"><p style="color:#1e293b;font-size:16px;">Hi <strong>${SecurityUtils.sanitizeHtml(data.senderName)}</strong>,</p><p style="color:#475569;font-size:15px;">I've received your message and will respond within 24-48 hours.</p><div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:20px;"><p style="font-size:12px;color:#166534;">Reference ID: <strong>${data.trackingId}</strong></p></div><p style="color:#1e293b;font-size:16px;">${CONFIG.OWNER.name}</p><p style="color:#64748b;font-size:14px;">${CONFIG.OWNER.title}</p></td></tr></table></body></html>`;
    const text = `MESSAGE RECEIVED ✓\n==================\n\nHi ${data.senderName},\n\nThank you for reaching out! I've received your message and will respond within 24-48 hours.\n\nReference ID: ${data.trackingId}\n\nBest regards,\n${CONFIG.OWNER.name}\n${CONFIG.OWNER.title}`;
    return { html, text };
  }
}
