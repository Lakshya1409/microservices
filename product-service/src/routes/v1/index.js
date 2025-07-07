import { Router } from "express";
import { productRouter } from "./product-router.js";

const router = Router();

router.use("/products", productRouter);

export { router };
