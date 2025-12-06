import express from "express";
import { protect } from "../middlewares/protect.js";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  cancelBooking,
} from "../controllers/bookings/bookingsController.js";
import { admin } from "../middlewares/admin.js";

const router = express.Router();

router.post("/:roomId", protect, createBooking);
router.get("/admin", protect, admin, getAllBookings);
router.get("/:id", protect, getBooking);
router.get("/:id", protect, deleteBooking);
router.put("/cancel/bookingId", protect, cancelBooking);

export default router;
