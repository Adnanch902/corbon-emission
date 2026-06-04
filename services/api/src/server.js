import { createApp } from "./app.js";
import { config } from "./config.js";
import { connectDatabase } from "./db.js";
import { initRetrainQueue } from "./lib/retrainQueue.js";

async function bootstrap() {
  await connectDatabase(config.mongoUri);
  initRetrainQueue();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`GLIP API running on port ${config.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start API:", error);
  process.exit(1);
});
