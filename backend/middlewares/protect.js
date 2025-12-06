import jwt from "jsonwebtoken";
import { db } from "../db/db.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [rows] = await db.query(
        "SELECT id, name, email, is_admin FROM users WHERE id = ?",
        [decoded.id]
      );
      if (rows.length === 0)
        return res.status(401).json({ message: "User not found" });

      req.user = rows[0];
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};
