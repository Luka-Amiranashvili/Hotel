import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../db/db.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, 0]
    );

    const userId = result.insertId;

    res.status(201).json({
      _id: userId,
      name,
      email,
      token: generateToken(userId),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      is_admin: user.is_admin === 1,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully", token: null });
};

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, role, is_admin FROM users ORDER BY id DESC"
    );
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
