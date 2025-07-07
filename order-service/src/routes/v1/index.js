import { Router } from "express";
import { orderRouter } from "./order-router.js";

const router = Router();

router.use("/orders", orderRouter);

export { router };
