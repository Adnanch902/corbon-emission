import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import axios from "axios";
import { config } from "../config.js";

let queue = null;

export function initRetrainQueue() {
  if (!config.enableRetrainQueue) return null;
  const connection = new IORedis(config.redisUrl, { maxRetriesPerRequest: null });
  queue = new Queue("ml-retrain", { connection });
  // Worker runs inside API process for now; can be split to dedicated worker later.
  // This keeps local setup simple while preserving queue semantics.
  new Worker(
    "ml-retrain",
    async () => {
      await axios.post(`${config.mlServiceUrl}/ml/train`);
    },
    { connection }
  );
  return queue;
}

export async function enqueueRetrainJob() {
  if (!queue) throw new Error("Retrain queue is not initialized");
  return queue.add("train-model", {}, { removeOnComplete: true, removeOnFail: 50 });
}

