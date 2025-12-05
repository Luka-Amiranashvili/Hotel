import { db } from "../../db/db.js";

const createRoom = async (req, res) => {
  try {
    const { name, type, price, capacity, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Room image is required" });
    }

    const imageUrl = `/uploads/rooms/${req.file.filename}`;

    const [result] = await db.query(
      "INSERT INTO rooms (name, type, price, capacity, description, image) VALUES (?, ?, ?, ?, ?, ?)",
      [name, type, price, capacity, description, imageUrl]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      type,
      price,
      capacity,
      description,
      image: imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getRooms = async (req, res) => {
  try {
    const [rooms] = await db.query("SELECT * FROM rooms");
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const [rooms] = await db.query("SELECT * FROM rooms WHERE id = ?", [id]);

    if (rooms.length === 0)
      return res.status(404).json({ message: "Room not found" });
    res.json(rooms[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, price, capacity, description } = req.body;

    const [result] = await db.query(
      "UPDATE rooms SET name=?, type=?, price=?, capacity=?, description=? WHERE id=?",
      [name, type, price, capacity, description, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Room not found" });

    res.json({ message: "Room updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM rooms WHERE id=?", [id]);
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getRooms, createRoom, updateRoom, getRoom, deleteRoom };
