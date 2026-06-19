/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

export interface ExtractedSocialInfo {
  platform: string;
  username: string;
  url: string;
  icon: string;
  caption: string;
  tags: string[];
  stats: string;
}

export interface BrandingInfo {
  name: string;
  tagline: string;
  location: string;
  timezone: string;
}

export interface ContactDataPayload {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  message: string;
  preferredContact?: 'email' | 'phone';
}

export type SubmissionStatus = 'idle' | 'sending' | 'success' | 'error';

export interface APIResponse {
  success: boolean;
  message: string;
  data?: {
    ticketId: string;
    estimatedResponse: string;
  };
}

export interface ContactData {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}
