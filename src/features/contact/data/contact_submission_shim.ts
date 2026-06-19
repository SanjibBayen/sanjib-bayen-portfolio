/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { ContactData } from '../types/contact.types';

export async function sendMessage(data: ContactData): Promise<{ status: number; text: string }> {
  if (!data.senderName || !data.senderEmail || !data.message) {
    return {
      status: 400,
      text: "Error: Please provide Name, Email and Message body."
    };
  }

  try {
    // Save to localStorage for real client-side tracking
    const submissions = JSON.parse(localStorage.getItem("portfolio_messages") || "[]");
    const newSubmission = {
      ...data,
      id: `MSG-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    submissions.push(newSubmission);
    localStorage.setItem("portfolio_messages", JSON.stringify(submissions));

    return {
      status: 200,
      text: `Success! Hello ${data.senderName}, your message has been compiled securely and logged locally. Sanjib will get back to you at ${data.senderEmail} shortly.`
    };
  } catch (err) {
    return {
      status: 500,
      text: "Internal State Error: Failed to save to local repository memory."
    };
  }
}
