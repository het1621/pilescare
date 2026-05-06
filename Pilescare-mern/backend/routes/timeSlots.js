import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

const ALL_SLOTS = [
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM",
  "4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM",
];

// GET /api/time-slots?date=YYYY-MM-DD
router.get("/", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ detail: "date query param required" });

  const booked = await Appointment.find({
    preferred_date: date,
    status: { $in: ["pending", "confirmed"] },
  }).select("time_slot");

  const bookedSlots = new Set(booked.map((a) => a.time_slot));

  res.json(ALL_SLOTS.map((slot) => ({ slot, available: !bookedSlots.has(slot) })));
});

export default router;
