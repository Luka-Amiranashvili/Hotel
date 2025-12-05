import express from "express";
import authRoutes from "./routes/authRoutes.js";
import roomsRoutes from "./routes/roomsRoutes.js";
import { db } from "./db/db.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomsRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
