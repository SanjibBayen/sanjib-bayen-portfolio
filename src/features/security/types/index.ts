/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

export interface SecurityState {
  clientIp: string;
  rayId: string;
  isScriptLoaded: boolean;
  isScriptLoading: boolean;
  isVerifying: boolean;
  isVerified: boolean;
  errorStatus: string;
  errorType: 'error' | 'expired' | 'timeout' | 'network' | 'server' | '';
  attemptCount: number;
  scriptLoadFailed: boolean;
}

export interface SecurityConfig {
  SITE_KEY: string;
  MAX_RETRIES: number;
  RETRY_DELAY: number;
  VERIFICATION_ENDPOINT: string;
  IP_INFO_ENDPOINT: string;
}

export interface DeviceMetrics {
  width: number;
  height: number;
  pixelRatio: number;
  userAgent: string;
  isMobile: boolean;
  isTablet: boolean;
}

declare global {
  interface Window {
    onloadTurnstileCallback?: () => void;
    turnstile?: {
      render: (container: string | HTMLElement, options: any) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}
