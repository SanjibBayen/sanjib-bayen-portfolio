/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Zero-Dependency Robust Geo IP lookup
 */

import { Request, Response, NextFunction } from "express";
import { CONFIG } from "../config";
import { SecurityLogger } from "../utils/logger";
import { SecurityUtils } from "../utils/security.utils";

export interface GeoLookupResult {
  country: string;
  region: string;
  city: string;
  ll: [number, number];
}

/**
 * Perform a zero-dependency geological IP lookup using regional HTTP headers from CDNs.
 * Fallback to standard indicators or safe defaults if not running under Vercel/Render.
 */
export function performGeoipLookup(ip: string, req?: Request): GeoLookupResult | null {
  try {
    if (!req) return null;

    // 1. check Vercel edge country and geo headers
    const vercelCountry = req.headers["x-vercel-ip-country"] || req.headers["x-vercel-country"];
    if (vercelCountry && typeof vercelCountry === "string") {
      return {
        country: vercelCountry.toUpperCase(),
        region: (req.headers["x-vercel-ip-country-region"] as string) || "",
        city: (req.headers["x-vercel-ip-city"] as string) || "",
        ll: [
          parseFloat((req.headers["x-vercel-ip-latitude"] as string) || "0"),
          parseFloat((req.headers["x-vercel-ip-longitude"] as string) || "0"),
        ],
      };
    }

    // 2. check Cloudflare / Render edge country and location headers
    const cfCountry = req.headers["cf-ipcountry"] || req.headers["x-render-ip-country"] || req.headers["x-country-code"];
    if (cfCountry && typeof cfCountry === "string") {
      return {
        country: cfCountry.toUpperCase(),
        region: (req.headers["x-render-ip-region"] as string) || "",
        city: (req.headers["x-render-ip-city"] as string) || "",
        ll: [0, 0],
      };
    }

    // 3. For development or fallback, return a safe default instead of loading heavy local DBs
    // which crash on serverless runtimes.
    return {
      country: "US",
      region: "CA",
      city: "San Francisco",
      ll: [37.7749, -122.4194],
    };
  } catch (err) {
    console.warn("Error looking up Geo IP location:", err);
  }
  return null;
}

export function geoBlockMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || "";
  if (ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1") {
    return next();
  }
  const geo = performGeoipLookup(ip, req);
  if (geo && CONFIG.GEO.blockedCountries.includes(geo.country)) {
    SecurityLogger.log("geo_blocked", { ip: SecurityUtils.hashIP(ip) }, "warn");
    return res.status(403).json({ error: "Access denied" });
  }
  res.locals.geo = geo;
  next();
}
