import express from "express";
import { protect } from "../middlewares/protect.js";
import { createBooking } from "../controllers/bookings/bookingsController.js";

const router = express.Router();

router.post("/:roomId", protect, createBooking);

export default router;
