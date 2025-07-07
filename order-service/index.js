import express from "express";
import { ServerConfig, Logger } from "./src/config/index.js";
import { ApiRoutes } from "./src/routes/index.js";
import { connectMongo } from "./src/config/mongo-config.js";

const app = express();

app.use(express.json());
app.use("/api", ApiRoutes);

connectMongo().then(() => {
  app.listen(ServerConfig.PORT, () => {
    Logger.info(
      `Order Service successfully started the server on PORT : ${ServerConfig.PORT}`
    );
  });
});
