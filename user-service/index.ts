import express from "express";
import { ServerConfig, logger } from "./src/config/index";
import { ApiRoutes } from "./src/routes";
import { connectMongo } from "./src/config/mongo-config";

const app = express();

app.use(express.json());
app.use("/api", ApiRoutes);

connectMongo().then(() => {
  app.listen(ServerConfig.PORT, () => {
    logger.info(
      `User Service successfully started the server on PORT : ${ServerConfig.PORT}`
    );
  });
});
