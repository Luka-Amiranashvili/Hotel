import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { db } from "./db/db.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
