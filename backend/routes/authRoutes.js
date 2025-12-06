import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
} from "../controllers/auth/authController.js";
import { protect } from "../middlewares/protect.js";
import { admin } from "../middlewares/admin.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/admin/getAllUsers", protect, admin, getAllUsers);

export default router;
