import { db } from "../../db/db.js";

const createBooking = async (req, res) => {
  try {
    const { check_in, check_out, guests } = req.body;
    const { roomId } = req.params;
    const user_id = req.user.id;

    if (!check_in || !check_out || !guests) {
      return res.status(400).json({ message: "Missing booking info" });
    }

    const [roomRows] = await db.query("SELECT * FROM rooms WHERE id = ?", [
      roomId,
    ]);
    if (roomRows.length === 0)
      return res.status(404).json({ message: "Room not found" });

    const room = roomRows[0];
    if (guests > room.capacity)
      return res.status(400).json({ message: "Guests exceed room capacity" });

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    const total_price = room.price * nights;

    const [result] = await db.query(
      "INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, total_price) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, roomId, check_in, check_out, guests, total_price]
    );

    res.status(201).json({
      booking_id: result.insertId,
      room_id: roomId,
      user_id,
      check_in,
      check_out,
      guests,
      total_price,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { createBooking };
