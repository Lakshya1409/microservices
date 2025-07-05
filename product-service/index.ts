import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.get("/products", (req, res) => {
  res.json({ message: "Product service is running!" });
});

app.listen(PORT, () => {
  console.log(`Product Service listening on port ${PORT}`);
});
