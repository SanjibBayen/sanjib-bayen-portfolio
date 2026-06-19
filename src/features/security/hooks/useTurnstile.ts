/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { SecurityState } from '@/features/security/types';
import { SECURITY_CONFIG, SecurityService } from '@/services/security.service';

const isLocalhost = () => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname.toLowerCase();
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.run.app') ||
    hostname.endsWith('.googleusercontent.com')
  );
};

export function useTurnstile(onVerify: () => void, onError?: (error: string) => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);
  const widgetRenderedRef = useRef(false);
  const scriptLoadedRef = useRef(false);

  const [state, setState] = useState<SecurityState>({
    clientIp: 'Detecting...',
    rayId: '',
    isScriptLoaded: false,
    isScriptLoading: true,
    isVerifying: false,
    isVerified: false,
    errorStatus: '',
    errorType: '',
    attemptCount: 0,
    scriptLoadFailed: false,
  });

  // Generate Ray ID
  useEffect(() => {
    const timestamp = Date.now().toString(16);
    const random = Array.from(
      { length: 16 },
      () => '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
    setState(prev => ({ ...prev, rayId: `${timestamp}-${random}`.substring(0, 19) }));
  }, []);

  // Fetch IP
  useEffect(() => {
    isMountedRef.current = true;
    SecurityService.fetchIpInfo().then(ip => {
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, clientIp: ip }));
      }
    });
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Set cookies helper
  const setVerificationCookies = useCallback(() => {
    const maxAge = 2592000;
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `cf_verified=true; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
    document.cookie = `cf_verified_time=${Date.now()}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
  }, []);

  // Handle Turnstile verification success
  const handleSuccess = useCallback(async (token: string) => {
    if (state.isVerified || state.isVerifying) return;

    setState(prev => ({ ...prev, isVerifying: true, errorStatus: '' }));

    const verified = await SecurityService.verifyWithServer(token);

    if (!verified) {
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isVerifying: false,
          errorStatus: 'Verification failed.',
          errorType: 'server',
        }));
        onError?.('Server verification failed');
      }
      return;
    }

    setVerificationCookies();

    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isVerified: true, isVerifying: false }));
      setTimeout(() => {
        if (isMountedRef.current) onVerify();
      }, 400);
    }
  }, [state.isVerified, state.isVerifying, onVerify, onError, setVerificationCookies]);

  // Load Cloudflare Turnstile Script
  useEffect(() => {
    if (isLocalhost()) {
      setVerificationCookies();
      setState(prev => ({ ...prev, isVerified: true, isVerifying: false }));
      setTimeout(() => {
        if (isMountedRef.current) onVerify();
      }, 300);
      return;
    }

    if (scriptLoadedRef.current) return;

    window.onloadTurnstileCallback = () => {
      if (isMountedRef.current) {
        scriptLoadedRef.current = true;
        setState(prev => ({ ...prev, isScriptLoaded: true, isScriptLoading: false }));
      }
    };

    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      window.onloadTurnstileCallback = undefined;
    };
  }, [onVerify, setVerificationCookies]);

  // Render widget on container
  useEffect(() => {
    if (isLocalhost()) return;
    if (!state.isScriptLoaded) return;
    if (!containerRef.current) return;
    if (!window.turnstile) return;
    if (widgetRenderedRef.current) return;

    widgetRenderedRef.current = true;

    const timer = setTimeout(() => {
      if (!isMountedRef.current || !containerRef.current) return;

      try {
        widgetIdRef.current = window.turnstile!.render(containerRef.current, {
          sitekey: SECURITY_CONFIG.SITE_KEY,
          theme: 'light',
          size: 'normal',
          retry: 'auto',
          'refresh-expired': 'auto',
          appearance: 'always',
          callback: (token: string) => handleSuccess(token),
          'error-callback': () => {
            console.warn('[useTurnstile] Turnstile verification error occurred');
            if (isMountedRef.current) {
              setState(prev => ({
                ...prev,
                errorStatus: 'Verification error. Please refresh.',
                errorType: 'error',
              }));
            }
          },
          'expired-callback': () => {
            if (isMountedRef.current) {
              widgetRenderedRef.current = false;
              widgetIdRef.current = null;
              setState(prev => ({
                ...prev,
                errorStatus: 'Challenge expired. Refresh to retry.',
                errorType: 'expired',
              }));
            }
          },
        });
      } catch (err) {
        console.error('[useTurnstile] Render failed:', err);
        widgetRenderedRef.current = false;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [state.isScriptLoaded, handleSuccess]);

  // General element cleaner & unmount trigger
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
        widgetRenderedRef.current = false;
      }
    };
  }, []);

  // Complete reload check & restart handle
  const handleRetry = useCallback(() => {
    widgetRenderedRef.current = false;
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      } catch {}
    }

    const existingScript = document.getElementById('cf-turnstile-script');
    if (existingScript) existingScript.remove();

    scriptLoadedRef.current = false;
    window.turnstile = undefined;
    window.onloadTurnstileCallback = undefined;

    setState(prev => ({
      ...prev,
      errorStatus: '',
      errorType: '',
      attemptCount: 0,
      isVerified: false,
      isVerifying: false,
      scriptLoadFailed: false,
      isScriptLoaded: false,
      isScriptLoading: true,
    }));

    window.onloadTurnstileCallback = () => {
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, isScriptLoaded: true, isScriptLoading: false }));
      }
    };

    const script = document.createElement('script');
    script.id = 'cf-turnstile-script';
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const bypassLocalhost = isLocalhost() || state.isVerified;

  return {
    state,
    containerRef,
    handleRetry,
    bypassLocalhost,
  };
}
