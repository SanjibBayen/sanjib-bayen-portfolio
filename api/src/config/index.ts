/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Server Configuration
 */

import crypto from "crypto";

export const CONFIG = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  DOMAIN: process.env.VERCEL_URL || `localhost:${process.env.PORT || 3000}`,
  IS_VERCEL: !!process.env.VERCEL,

  RESEND: {
    apiKey: process.env.RESEND_API_KEY || "",
    fromEmail: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    fromName: process.env.RESEND_FROM_NAME || "Sanjib Bayen",
  },

  TURNSTILE: {
    secretKey: process.env.TURNSTILE_SECRET_KEY || "1x00000000000000000000000000000000",
    siteKey: process.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
    verificationURL: "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    timeout: 5000,
    retries: 2,
  },

  ENCRYPTION: {
    algorithm: "aes-256-gcm" as const,
    key:
      process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_SALT
        ? crypto.scryptSync(
            process.env.ENCRYPTION_KEY,
            process.env.ENCRYPTION_SALT,
            32,
          )
        : crypto.scryptSync(
            "fallback-encryption-key-secure",
            "fallback-salt-value",
            32,
          ),
    ivLength: 16,
    tagLength: 16,
  },

  GEO: {
    blockedCountries: ["KP", "IR", "SY", "CU", "SD"] as string[],
    allowProxy: true,
  },

  SECURITY: {
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      maxRequests: 200,
      cleanupInterval: 5 * 60 * 1000,
    },
    contactRateLimit: {
      maxRequests: 3,
      windowMs: 15 * 60 * 1000,
      blockDuration: 60 * 60 * 1000,
    },

    cors: {
      origin: (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean),
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "X-CSRF-Token",
        "X-Request-ID",
        "X-Turnstile-Token",
      ],
      credentials: true,
      maxAge: 86400,
    },

    bodyLimit: "10kb",
    maxHeaderSize: 8192,
    maxUrlLength: 2048,

    requestSizes: {
      "/api/v1/contact": 10240,
      "/api/v1/turnstile-verify": 1024,
      "/api/v1/security-analytics": 2048,
      "/api/v1/ip-info": 512,
      default: 5120,
    } as Record<string, number>,

    sessionSecret: process.env.SESSION_SECRET || "session-fallback-secret-key-safe",
    sessionMaxAge: 3600000,

    csrfTokenLength: 32,
    csrfCookieName: "csrf_token",
    fingerprintCookieName: "_fp",
    fingerprintMaxAge: 3600000,

    turnstileVerificationMaxAge: 3600000,
  },

  OWNER: {
    email: process.env.OWNER_EMAIL || "",
    name: process.env.OWNER_NAME || "Sanjib Bayen",
    company: process.env.COMPANY_NAME || "Bayen.Tech",
    title: process.env.OWNER_TITLE || "Software Engineer",
    website: process.env.OWNER_WEBSITE || "https://sanjib-bayen.vercel.app",
  },
} as const;

// Ensure strict environment validation
const requiredEnvVars = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  ENCRYPTION_SALT: process.env.ENCRYPTION_SALT,
  SESSION_SECRET: process.env.SESSION_SECRET,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  const message = `Missing environment variables: ${missingVars.join(", ")}`;
  console.warn(`⚠️ Warning: ${message}`);
  console.warn(
    "Server will start with robust fallback values, but some features require proper environment configuration in production."
  );
}
