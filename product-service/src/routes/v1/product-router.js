import { Router } from "express";
import { info } from "../../controllers/index.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Product service is running!" });
});

router.get("/info", info);

router.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

export { router as productRouter };
