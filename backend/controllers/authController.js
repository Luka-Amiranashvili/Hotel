import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/db.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (existing.length > 0)
    return res.status(400).json({ message: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  const userId = result.insertId;
  res.status(201).json({
    _id: userId,
    name,
    email,
    token: generateToken(userId),
  });
};
