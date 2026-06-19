/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

export const SECURITY_CONFIG = {
  SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
  MAX_RETRIES: 3,
  RETRY_DELAY: 2500,
  VERIFICATION_ENDPOINT: '/api/v1/turnstile-verify',
  IP_INFO_ENDPOINT: '/api/v1/ip-info',
};

export class SecurityService {
  static async verifyWithServer(token: string): Promise<boolean> {
    try {
      const res = await fetch(SECURITY_CONFIG.VERIFICATION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turnstileToken: token }),
      });
      if (!res.ok) {
        return false;
      }
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.error('[SecurityService] Server verification failed:', err);
      return false;
    }
  }

  static async fetchIpInfo(): Promise<string> {
    try {
      const res = await fetch(SECURITY_CONFIG.IP_INFO_ENDPOINT);
      if (!res.ok) {
        return 'Detected';
      }
      const data = await res.json();
      return data.data?.hashedIp || 'Detected';
    } catch (err) {
      console.error('[SecurityService] IP fetch failed:', err);
      return 'Detected';
    }
  }
}
