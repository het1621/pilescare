import express from "express";
import rateLimit from "express-rate-limit";
import Appointment from "../models/Appointment.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, handler: (req, res) => res.status(429).json({ detail: 'Too many requests, please try again later.' }) });

// POST /api/appointments  (public)
router.post("/", strictLimiter, async (req, res) => {
  try {
    const appt = await Appointment.create(req.body);
    res.status(201).json(appt);
  } catch (err) {
    res.status(400).json({ detail: err.message });
  }
});

// GET /api/appointments  (admin)
router.get("/", protect, adminOnly, async (req, res) => {
  const { status, date } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (date)   filter.preferred_date = date;
  const appts = await Appointment.find(filter).sort({ createdAt: -1 });
  res.json(appts);
});

// PATCH /api/appointments/:id  (admin)
router.patch("/:id", protect, adminOnly, async (req, res) => {
  const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!appt) return res.status(404).json({ detail: "Appointment not found" });
  res.json(appt);
});

// DELETE /api/appointments/:id  (admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
