/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Express Application Setup
 */

import express, { Request, Response, NextFunction } from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import compression from "compression";
import cookieParser from "cookie-parser";
import useragent from "express-useragent";

import { CONFIG } from "./config";
import apiRoutes from "./routes/api.routes";
import { securityHeadersMiddleware, fingerprintMiddleware, requestSizeMiddleware } from "./middleware/securityHeaders";
import { geoBlockMiddleware } from "./middleware/geo";
import { idsMiddleware } from "./middleware/ids";
import { botMiddleware } from "./middleware/bot";
import { generalRateLimitMiddleware } from "./middleware/rateLimiter";

const app = express();

app.set("trust proxy", 1);

// CONFIG 1: Cookie Parser
app.use(cookieParser(CONFIG.SECURITY.sessionSecret));

// CONFIG 2: Security Headers
app.use(securityHeadersMiddleware);

// CONFIG 3: Helmet CSP policies
if (CONFIG.IS_PRODUCTION) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "https://challenges.cloudflare.com"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: ["'self'", "https://challenges.cloudflare.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
          frameSrc: ["'self'", "https://challenges.cloudflare.com"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    }),
  );
  console.log("🔒 CSP ENABLED for production");
} else {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      hsts: false,
    }),
  );
  console.log("🔓 CSP disabled - Vite HMR enabled");
}

// CONFIG 4-8: CORS, HPP, Compression, UserAgent, BodyParser
app.use(cors(CONFIG.SECURITY.cors as any));
app.use(hpp({ whitelist: ["message", "subject"] }));
app.use(compression({ level: 6, threshold: 1024 }));
app.use(useragent.express());
app.use(express.json({ limit: CONFIG.SECURITY.bodyLimit }));
app.use(
  express.urlencoded({ extended: false, limit: CONFIG.SECURITY.bodyLimit }),
);

// CONFIG 9: Request Size Guards
app.use(requestSizeMiddleware);

// CONFIG 10-13: Geo block, IDS intrusion checks, General Rate Limits, Bot Prevention
app.use(geoBlockMiddleware);
app.use(idsMiddleware);
app.use(generalRateLimitMiddleware);
app.use(botMiddleware);

// ============================================
// API Routing Gateway
// ============================================
app.use("/api", apiRoutes);

// Fingerprint generation wrapper
app.use(fingerprintMiddleware);

// ============================================
// Static Assets & SPA Fallbacks
// ============================================
if (CONFIG.IS_PRODUCTION) {
  const distPath = path.join(process.cwd(), "dist");
  app.use(
    express.static(distPath, {
      maxAge: "1y",
      etag: true,
    }),
  );
  app.get("*", (req: Request, res: Response) => {
    if (!req.path.startsWith("/api/")) {
      res.sendFile(path.join(distPath, "index.html"));
    }
  });
} else {
  // Lazy-load Vite dev server middleware to handle routing and bundling on the fly
  let vitePromise: Promise<any> | null = null;
  const getViteMiddleware = () => {
    if (!vitePromise) {
      vitePromise = import("vite").then(({ createServer }) =>
        createServer({
          server: { middlewareMode: true },
          appType: "spa",
        })
      );
    }
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  };
  app.use(getViteMiddleware());
}

// 404 Endpoint handler
app.use("/api/*", (req: Request, res: Response) => {
  res.status(404).json({ success: false, error: "Not Found" });
});

// Centralized Error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Error payload:", err);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

export default app;
