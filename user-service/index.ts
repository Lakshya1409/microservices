import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/users", (req, res) => {
  res.json({ message: "User service is running!" });
});

app.listen(PORT, () => {
  console.log(`User Service listening on port ${PORT}`);
});
