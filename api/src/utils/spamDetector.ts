/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Spam Detection Utility
 */

export class SpamDetector {
  private static spamKeywords = [
    "viagra",
    "cialis",
    "levitra",
    "casino",
    "slots",
    "poker",
    "lottery",
    "winner",
    "prize",
    "crypto currency",
    "bitcoin",
    "investment opportunity",
    "earn money",
    "make money fast",
    "seo services",
    "buy backlinks",
    "nigerian prince",
    "inheritance",
    "wire transfer",
  ];

  static calculateScore(data: {
    subject?: string;
    message: string;
    senderEmail: string;
    senderName?: string;
  }): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];
    const content = `${data.subject || ""} ${data.message}`.toLowerCase();
    const foundKeywords = this.spamKeywords.filter((k) => content.includes(k));
    if (foundKeywords.length > 0) {
      score += foundKeywords.length * 0.15;
      reasons.push(`Spam keywords detected`);
    }
    const urls = content.match(/https?:\/\/[^\s]+/g) || [];
    if (urls.length > 3) {
      score += 0.3;
      reasons.push(`Excessive URLs: ${urls.length}`);
    }
    const letters = content.replace(/[^a-zA-Z]/g, "");
    if (letters.length > 0) {
      const capsRatio = letters.replace(/[^A-Z]/g, "").length / letters.length;
      if (capsRatio > 0.7) {
        score += 0.3;
        reasons.push("Excessive capitalization");
      }
    }
    return { score: Math.min(score, 1), reasons };
  }
}
