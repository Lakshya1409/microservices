import express from "express";
import { ServerConfig, Logger } from "./src/config";
import { ApiRoutes } from "./src/routes";
import { connectMongo } from "./src/config/mongo-config";

const app = express();

app.use(express.json());
app.use("/api", ApiRoutes);

connectMongo().then(() => {
  app.listen(ServerConfig.PORT, () => {
    Logger.info(
      `Successfully started the server on PORT : ${ServerConfig.PORT}`
    );
  });
});
