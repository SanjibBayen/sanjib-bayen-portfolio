/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useTurnstile } from '@/features/security/hooks/useTurnstile';

interface SecurityGateProps {
  onVerify: () => void;
  onError?: (error: string) => void;
}

export default function SecurityGate({ onVerify, onError }: SecurityGateProps) {
  const { state, containerRef, handleRetry, bypassLocalhost } = useTurnstile(
    onVerify,
    onError
  );

  if (bypassLocalhost) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-[#ffffff] flex flex-col items-center justify-center p-6 z-[100] select-none font-sans"
      role="dialog"
      aria-label="Security Verification"
    >
      {/* Visual warning icon matching reference exactly */}
      <div className="mb-6 flex justify-center">
        <svg
          className="w-28 h-28"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 44.5,18.5 A 6.3,6.3 0 0,1 55.5,18.5 L 94.5,82.5 A 6.3,6.3 0 0,1 89,91.5 L 11,91.5 A 6.3,6.3 0 0,1 5.5,82.5 Z"
            fill="#b9d5fa"
          />
          <rect x="47.5" y="38" width="5" height="24" rx="2.5" fill="white" />
          <circle cx="50" cy="71" r="3.5" fill="white" />
        </svg>
      </div>

      <div className="flex flex-col items-center text-center">
        <h1 className="text-[28px] font-semibold text-[#323232] tracking-tight mb-3">
          Security check required
        </h1>
        <p className="text-[17px] text-[#555555] max-w-[540px] leading-relaxed mb-8">
          We've detected unusual activity from your network. To continue, complete the security check below.
        </p>
      </div>

      {/* Turnstile Widget Box */}
      {!state.isVerified && !state.isVerifying && (
        <div className="flex flex-col items-center justify-center min-h-[96px] w-full transition-all mb-4">
          {state.isScriptLoading ? (
            <div className="flex flex-col items-center justify-center py-4 text-gray-400">
              <RefreshCw className="w-5 h-5 text-gray-400 animate-spin mb-2" />
              <span className="text-[13px]">Loading verification...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <div
                ref={containerRef}
                className="flex justify-center min-h-[65px] h-auto overflow-hidden rounded"
              />
            </div>
          )}
        </div>
      )}

      {/* Error Alert Box */}
      {state.errorStatus && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-5 flex items-start gap-2.5 max-w-sm">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-[12px] font-bold text-red-800">Security Check Failed</p>
            <p className="text-[11px] text-red-700 leading-normal">{state.errorStatus}</p>
          </div>
        </div>
      )}

      {/* Refresh Action Trigger */}
      {!state.isVerified && !state.isVerifying && !state.isScriptLoading && (
        <button
          onClick={handleRetry}
          className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 transition-all duration-200 rounded py-2 px-4 text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm cursor-pointer mb-6"
        >
          <RefreshCw className="w-3 h-3 shrink-0" />
          Reload verification
        </button>
      )}

      {/* Metadata Telemetry */}
      <div className="flex flex-col items-center gap-1 text-[13px] text-[#555555] font-sans mt-2 select-text">
        <div>
          Ray ID: <span className="font-medium">{state.rayId}</span>
        </div>
        <div>
          Client IP: <span className="font-medium">{state.clientIp}</span>
        </div>
      </div>

      {/* Copyright branding footer */}
      <div className="mt-8 text-[13px] text-[#8c8c8c] font-sans">
        © 2026 Sanjib Bayen. All rights reserved.
      </div>
    </div>
  );
}
