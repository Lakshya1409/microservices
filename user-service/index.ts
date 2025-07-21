import express from "express";
import helmet from "helmet";
import cors from "cors";
import { ServerConfig, logger } from "./src/config";
import { ApiRoutes } from "./src/routes";
import { connectMongo } from "./src/config/mongo-config";
import { authenticateToken } from "./src/middlewares/auth-middleware";
import { ResponseUtils } from "./src/utils/response";
import { SUCCESS_MESSAGES } from "./src/utils/messages";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  ResponseUtils.success(
    res,
    {
      timestamp: new Date().toISOString(),
    },
    SUCCESS_MESSAGES.SERVICE_RUNNING
  );
});

// Apply default authentication middleware to all routes
app.use(authenticateToken);

// API routes
app.use("/api", ApiRoutes);

connectMongo().then(() => {
  app.listen(ServerConfig.PORT, () => {
    logger.info(
      `User Service successfully started the server on PORT : ${ServerConfig.PORT}`
    );
  });
});
