import express from "express";
import { AboutProfile } from "../models/index.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const DEFAULT_ABOUT = {
  name: "Dr. Vishva Patel",
  title: "Consultant Proctologist",
  location: "Vadodara",
  image_url: "https://customer-assets.emergentagent.com/job_vishva-proctology/artifacts/k64gpu3c_WhatsApp%20Image%202026-04-25%20at%209.09.47%20PM.jpeg",
  bio: "Dr. Vishva is a fellowship-trained proctology specialist with over a decade of focused experience in modern laser-assisted treatments for piles, fissure, fistula, and complex ano-rectal conditions. Trusted by thousands of patients for clarity, kindness, and clinical excellence.\n\nAfter completing his post-graduation from MS University Baroda, Dr. Vishva pursued a Fellowship in Minimal Access Surgery and went on to receive advanced training in 1470nm diode laser proctology — one of fewer than 200 surgeons in Gujarat with this specialisation.\n\nHis clinic was built on a single conviction: metro-quality specialist care should be accessible in tier-2 cities — delivered with empathy, transparency, and zero stigma.",
  features: [
    "5,000+ laser procedures performed",
    "Day-care surgery — home same day",
    "Zero-complication streak on routine piles",
    "Offers both in-clinic and video consults",
    "Speaks Gujarati, Hindi & English",
    "Post-op emergency support hotline"
  ],
  credentials: [
    { label: "MBBS", body: "Baroda Medical College, MS University" },
    { label: "MS", body: "General Surgery — Gold Medalist" },
    { label: "FMAS", body: "Fellowship in Minimal Access Surgery" },
    { label: "FIAGES", body: "Fellow, Indian Association of GI Endoscopic Surgeons" }
  ],
  cards: [
    { title: "Qualifications", description: "MBBS, MS (General Surgery), Fellowship in Minimal Access Surgery (FMAS), Advanced Laser Proctology Training." },
    { title: "Experience", description: "12+ years dedicated to proctology. Performed 5,000+ laser procedures with industry-leading outcomes." },
    { title: "Specialisations", description: "Laser hemorrhoidoplasty, FiLaC, VAAFT, sphincter-preserving fistula surgery, and chronic fissure care." },
    { title: "Philosophy", description: "Patient-first, unhurried, judgement-free. Your privacy and dignity are non-negotiable." }
  ],
  mission_title: "Our Patient-First Mission",
  mission_text: "Proctology problems are among the most stigmatised in healthcare — yet they affect millions silently. Our mission is simple: bring metro-grade specialist care to tier-2 cities, deliver it with empathy, and remove the awkwardness that keeps people from seeking help. Every consultation, every procedure, every follow-up is designed around you.",
  stats: {
    procedures: "5000+",
    experience: "12+",
    satisfaction: "98%",
    patients: "10k+"
  }
};

// GET /api/about
router.get("/", async (req, res) => {
  try {
    let profile = await AboutProfile.findOne();
    if (!profile) {
      profile = await AboutProfile.create(DEFAULT_ABOUT);
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// PATCH /api/about
router.patch("/", protect, adminOnly, async (req, res) => {
  try {
    let profile = await AboutProfile.findOne();
    if (!profile) {
      profile = new AboutProfile();
    }
    Object.assign(profile, req.body);
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(400).json({ detail: error.message });
  }
});

export default router;
