import { Router } from "express";
import { notificationRouter } from "./notification-router.js";

const router = Router();

router.use("/notifications", notificationRouter);

export { router };
