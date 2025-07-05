import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.get("/orders", (req, res) => {
  res.json({ message: "Order service is running!" });
});

app.listen(PORT, () => {
  console.log(`Order Service listening on port ${PORT}`);
});
