/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Copyright 2026 Sanjib Bayen
 * 
 * Interactive IDE Portfolio - Backend Server Entrypoint
 */

import "dotenv/config";
import app from "./app";
import { CONFIG } from "./config";
import { rateLimiter } from "./middleware/rateLimiter";

async function startServer() {
  try {
    console.log(
      `\n🚀 PORTFOLIO SERVER | ${CONFIG.NODE_ENV} | Port: ${CONFIG.PORT}\n`,
    );

    const server = app.listen(CONFIG.PORT, "0.0.0.0", () => {
      console.log(`✅ Server: http://localhost:${CONFIG.PORT}`);
    });

    const shutdown = () => {
      console.log("Shutting down server connections...");
      server.close(() => {
        rateLimiter.destroy();
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Failed to start server listener:", error);
    process.exit(1);
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
