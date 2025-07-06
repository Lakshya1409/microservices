import { Router } from "express";
import { info } from "../../controllers";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "User service is running!" });
});

router.get("/info", info);

router.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

export { router as userRouter };
