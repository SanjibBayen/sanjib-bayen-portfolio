/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Bot Detection Middleware
 */

import { Request, Response, NextFunction } from "express";
import { SecurityLogger } from "../utils/logger";
import { SecurityUtils } from "../utils/security.utils";

export function botMiddleware(req: Request, res: Response, next: NextFunction) {
  if (SecurityUtils.isBot(req.headers["user-agent"] || "")) {
    SecurityLogger.log("bot_blocked", {}, "warn");
    return res.status(403).json({ error: "Automated access not permitted" });
  }
  next();
}
