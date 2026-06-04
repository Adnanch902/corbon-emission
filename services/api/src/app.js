import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import healthRoutes from "./routes/health.js";
import v1Routes from "./routes/v1.js";
import { config } from "./config.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: "1mb" }));
  app.use((req, res, next) => {
    const requestId = req.headers["x-request-id"] || crypto.randomUUID();
    req.requestId = requestId;
    res.setHeader("x-request-id", requestId);
    next();
  });
  app.use(morgan("dev"));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300
    })
  );

  app.use("/", healthRoutes);
  app.use("/api/v1", v1Routes);

  app.use((err, _req, res, _next) => {
    res.status(500).json({
      message: "Internal server error",
      requestId: _req.requestId,
      detail: config.nodeEnv === "development" ? err.message : undefined
    });
  });

  return app;
}
