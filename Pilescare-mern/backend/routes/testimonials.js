import express from "express";
import { Testimonial } from "../models/index.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
const FALLBACK = [
  { name: "Rahul M.", city: "Vadodara", rating: 5, service: "Laser Piles", text: "I had been suffering for 3 years. Dr. Vishva solved it in one day. The procedure was completely painless. Highly recommended to anyone facing this problem." },
  { name: "Priya S.", city: "Surat", rating: 5, service: "Fissure", text: "Very professional and kind doctor. I was embarrassed to discuss my condition but Dr. Vishva made me feel completely at ease right from the first consultation." },
  { name: "Amit K.", city: "Baroda", rating: 5, service: "VAAFT Fistula", text: "Went in the morning, was home by lunch. No cuts, no stitches, no pain. Zero complications. I wish I had done this years earlier instead of suffering in silence." },
  { name: "Neha R.", city: "Anand", rating: 5, service: "Online Consult", text: "The online consultation was incredibly convenient. Clear diagnosis, proper prescription, detailed follow-up plan — all from the comfort of home. 5 stars." },
  { name: "Suresh P.", city: "Vadodara", rating: 5, service: "Piles", text: "Post-surgery care was exceptional. The team called me twice a day for the first week. That level of personal attention is rare anywhere, let alone in Vadodara." },

  { name: "Kavita D.", city: "Rajkot", rating: 5, service: "Fissure", text: "I was very scared before the surgery. Dr. Vishva explained everything so clearly and patiently. No pain at all, and back to normal work in just 2 days." },
  { name: "Mohan T.", city: "Ahmedabad", rating: 5, service: "Pilonidal", text: "Trusted this clinic based on online reviews and they far exceeded my expectations. Modern operation theatre, experienced team, and genuinely painless results." },
  { name: "Ritu A.", city: "Vadodara", rating: 5, service: "Consultation", text: "Dr Vishva explains in simple, clear language. No jargon, no pressure. Very reassuring for first-time patients who are nervous about proctology issues." },
  { name: "Dinesh V.", city: "Surat", rating: 5, service: "Fistula", text: "Entire experience was world-class. From the seamless booking process to the follow-up calls — it genuinely feels like a premium metro-city clinic." },
];

router.get("/", async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();
    if (count === 0) {
      await Testimonial.insertMany(FALLBACK);
    }
    // Check if it's admin (we could differentiate but for now we just return all in admin)
    // Wait, let's create /admin/all
    res.json(await Testimonial.find({ visible: true }).sort({ createdAt: -1 }));
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});
router.get("/admin/all", protect, adminOnly, async (_, res) => {
  try {
    const count = await Testimonial.countDocuments();
    if (count === 0) {
      await Testimonial.insertMany(FALLBACK);
    }
    res.json(await Testimonial.find().sort({ createdAt: -1 }));
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});
router.post("/",      protect, adminOnly, async (req, res) => { try { res.status(201).json(await Testimonial.create(req.body)); } catch (e) { res.status(400).json({ detail: e.message }); } });
router.patch("/:id",  protect, adminOnly, async (req, res) => { const d = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true }); d ? res.json(d) : res.status(404).json({ detail: "Not found" }); });
router.delete("/:id", protect, adminOnly, async (req, res) => { try { await Testimonial.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { res.status(500).json({ detail: e.message }); } });
export default router;
