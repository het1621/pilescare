import express from "express";
import { Service } from "../models/index.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const FALLBACK = [
  { icon: "HeartPulse", title: "Laser Piles", slug: "laser-piles", summary: "Painless, bloodless day-care laser procedure. Back to normal life within 48 hours.", details: ["1470nm diode laser", "No cuts or stitches", "Same-day discharge", "99% success rate"] },
  { icon: "Stethoscope", title: "Anal Fissure Treatment", slug: "fissure", summary: "Chronic and acute fissures treated with BOTOX or LIS. Zero incontinence risk.", details: ["BOTOX injection therapy", "Lateral internal sphincterotomy", "Rapid healing", "Pain-free recovery"] },
  { icon: "ShieldPlus", title: "Fistula Surgery (VAAFT)", slug: "fistula", summary: "Video-assisted sphincter-saving fistula treatment — highest cure rate, no sphincter damage.", details: ["Sphincter preservation", "Video-guided precision", "Low recurrence", "Day-care procedure"] },
  { icon: "Sparkles", title: "Pilonidal Sinus", slug: "pilonidal", summary: "Minimally invasive EPSIT technique. No open wound, fast return to work.", details: ["EPSIT technique", "No open wound", "2–3 days rest only", "High cure rate"] },
  { icon: "Video", title: "Online Consultation", slug: "online", summary: "Confidential video consultation with Dr. Vishva from the privacy of your home.", details: ["Secure video platform", "Prescription provided", "Lab review included", "Follow-up support"] },
  { icon: "Calendar", title: "Follow-up Care", slug: "followup", summary: "Structured post-procedure care to ensure complete healing and prevent recurrence.", details: ["Personalised diet plan", "Wound dressing guidance", "Emergency helpline", "Medication review"] },
];

router.get("/", async (_, res) => {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      await Service.insertMany(FALLBACK);
    }
    res.json(await Service.find().sort({ sort_order: 1 }));
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});
router.post("/",      protect, adminOnly, async (req, res) => { try { res.status(201).json(await Service.create(req.body)); } catch (e) { res.status(400).json({ detail: e.message }); } });
router.patch("/:id",  protect, adminOnly, async (req, res) => {
  try {
    const s = await Service.findById(req.params.id);
    if (!s) return res.status(404).json({ detail: "Not found" });
    Object.assign(s, req.body);
    await s.save();
    res.json(s);
  } catch (e) { res.status(400).json({ detail: e.message }); }
});
router.delete("/:id", protect, adminOnly, async (req, res) => { try { await Service.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { res.status(500).json({ detail: e.message }); } });

export default router;
