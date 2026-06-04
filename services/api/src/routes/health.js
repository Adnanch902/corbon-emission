import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "glip-api"
  });
});

export default router;

