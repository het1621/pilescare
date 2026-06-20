import express from "express";
import { HomeContent } from "../models/index.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const DEFAULT_HOME = {
  hero_headline: "Advanced Laser Proctology",
  hero_subheadline: "Painless, precise, private — modern piles treatment by a specialist you can trust. Walk in with worry, walk out with relief.",
  hero_cta_text: "Book a Consultation",
  hero_cta_link: "/book",
  stats: [
    { value: 5000, suffix: "+", label: "Procedures Done" },
    { value: 12, suffix: "+", label: "Years Focused Experience" },
    { value: 98, suffix: "%", label: "Patient Satisfaction" },
    { value: 10, suffix: "k+", label: "Patients Treated" },
  ],
  process_steps: [
    { number: "01", title: "Book Online", description: "Choose a date and slot that works for you. Instant confirmation." },
    { number: "02", title: "Consultation", description: "Private 1-on-1 with Dr. Vishva. Diagnosis, Q&A, treatment plan." },
    { number: "03", title: "Day-Care Procedure", description: "Laser procedure in our modern OT. Arrive at 9 AM, home by noon." },
    { number: "04", title: "Recovery & Care", description: "Dedicated follow-up calls, diet plan, and emergency support line." },
  ],
  phone_number: "+91 99999 99999",
  whatsapp_number: "919999999999",
  hero_particle_color: "#1A5B5E",
  hero_particle_count: 80,
  hero_bg_gradient_from: "#0e1b19",
  hero_bg_gradient_to: "#122a27",
};

// GET /api/home-content
router.get("/", async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) {
      content = await HomeContent.create(DEFAULT_HOME);
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// PATCH /api/home-content
router.patch("/", protect, adminOnly, async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) {
      content = new HomeContent();
    }
    Object.assign(content, req.body);
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(400).json({ detail: error.message });
  }
});

export default router;
