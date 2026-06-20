import express from "express";
import rateLimit from "express-rate-limit";
import Appointment from "../models/Appointment.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sendMail } from "../config/mailer.js";
import {
  confirmedEmailTemplate,
  cancelledEmailTemplate,
  completedEmailTemplate,
} from "../config/emailTemplates.js";

const router = express.Router();

const strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, handler: (req, res) => res.status(429).json({ detail: 'Too many requests, please try again later.' }) });

// POST /api/appointments  (public)
router.post("/", strictLimiter, async (req, res) => {
  try {
    // Whitelist only safe public fields — prevents mass-assignment
    const { patient_name, contact_number, email, service, preferred_date, time_slot, consultation_type, notes } = req.body;
    const appt = await Appointment.create({ patient_name, contact_number, email, service, preferred_date, time_slot, consultation_type, notes });
    res.status(201).json(appt);
  } catch (err) {
    res.status(400).json({ detail: err.message });
  }
});

// GET /api/appointments  (admin)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (date)   filter.preferred_date = date;
    const appts = await Appointment.find(filter).sort({ createdAt: -1 });
    res.json(appts);
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});

// Map statuses to their email template generators and subjects
const EMAIL_TEMPLATES = {
  confirmed: { subject: "✅ Your Appointment is Confirmed — ProctoCare by Vishva", template: confirmedEmailTemplate },
  cancelled: { subject: "❌ Appointment Cancelled — ProctoCare by Vishva",         template: cancelledEmailTemplate },
  completed: { subject: "🎉 Appointment Completed — ProctoCare by Vishva",         template: completedEmailTemplate },
};

// PATCH /api/appointments/:id  (admin)
router.patch("/:id", protect, adminOnly, async (req, res) => {
  try {
    // 1. Fetch the current appointment to detect status change
    const oldAppt = await Appointment.findById(req.params.id);
    if (!oldAppt) return res.status(404).json({ detail: "Appointment not found" });

    const oldStatus = oldAppt.status;

    // 2. Apply the update
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // 3. Build response with email info
    const response = { ...appt.toObject(), emailSent: false, emailSkipReason: null };

    // 4. Check if status changed to a trigger status
    const newStatus = appt.status;
    const statusChanged = oldStatus !== newStatus;
    const templateConfig = EMAIL_TEMPLATES[newStatus];

    if (statusChanged && templateConfig) {
      if (!appt.email) {
        response.emailSkipReason = "no_email";
        console.log(`⚠️ Status → ${newStatus} but patient has no email — skipping notification`);
      } else {
        const html = templateConfig.template(appt);
        const result = await sendMail({
          to: appt.email,
          subject: templateConfig.subject,
          html,
        });
        if (result.success) {
          response.emailSent = true;
        } else {
          response.emailSkipReason = "send_failed";
        }
      }
    }

    res.json(response);
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});

// DELETE /api/appointments/:id  (admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});

export default router;
