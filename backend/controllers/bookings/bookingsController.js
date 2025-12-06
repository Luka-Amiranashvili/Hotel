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
      "INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user_id, roomId, check_in, check_out, guests, total_price, "pending"]
    );

    res.status(201).json({
      booking_id: result.insertId,
      room_id: roomId,
      user_id,
      check_in,
      check_out,
      guests,
      total_price,
      status: "pending",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, r.name AS room_name 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id
       ORDER BY b.id DESC`
    );

    const now = new Date();
    const updatedRows = rows.map((b) => {
      let status = b.status;
      const checkOut = new Date(b.check_out);

      if (checkOut < now) status = "completed";
      const checkIn = new Date(b.check_in);
      if (checkIn > now) status = "upcoming";
      if (checkIn <= now && checkOut >= now) status = "ongoing";
      return { ...b, status };
    });

    res.status(200).json(updatedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`SELECT * FROM bookings WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const [result] = await db.query(
      `DELETE FROM bookings WHERE id = ? AND user_id = ?`,
      [bookingId, req.user.id]
    );

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ message: "Booking not found or not yours" });

    res.status(200).json({ message: "Booking deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const user_id = req.user.id;

    const [result] = await db.query(
      "UPDATE bookings SET status='cancelled' WHERE id=? AND user_id=? AND status='upcoming'",
      [bookingId, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Cannot cancel this booking" });
    }
    res.status(200).json({ message: "Booking cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createBooking,
  getAllBookings,
  getBooking,
  deleteBooking,
  cancelBooking,
};
