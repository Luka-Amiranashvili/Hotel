import express from "express";
import {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/rooms/roomsController.js";

import { protect } from "../middlewares/protect.js";

const router = express.Router();

router.post("/", protect, createRoom);
router.get("/", getRooms);
router.get("/:id", getRoom);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router;
