import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/glip",
  mlServiceUrl: process.env.ML_SERVICE_URL || "http://localhost:8000",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "dev-refresh-secret",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  enableRetrainQueue: process.env.ENABLE_RETRAIN_QUEUE === "true"
};
