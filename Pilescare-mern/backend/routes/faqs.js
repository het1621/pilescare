import express from "express";
import { FAQ } from "../models/index.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
const FALLBACK = [
  { category: "Concerns", question: "Is piles surgery painful?", answer: "With modern laser surgery, there is virtually no pain during or after the procedure. Most patients report only mild discomfort for 1–2 days, well-managed with simple painkillers. The old 'open' haemorrhoidectomy was painful — laser is not." },
  { category: "Concerns", question: "How do I know if I need surgery or not?", answer: "A consultation with Dr. Vishva will determine this. Grade 1 and 2 piles often respond to medication and dietary changes. Grade 3 and 4 generally benefit from laser. Many patients avoid surgery entirely with early treatment." },
  { category: "Treatments", question: "What is laser piles surgery?", answer: "Laser piles (hemorrhoidoplasty) uses a 1470nm diode laser fibre inserted into the pile mass. The laser energy shrinks the tissue from inside without cutting or stitching. It is performed under local anaesthesia, takes 20–30 minutes, and you go home the same day." },
  { category: "Treatments", question: "What is VAAFT for fistula?", answer: "VAAFT (Video-Assisted Anal Fistula Treatment) uses a miniature video scope to visualise the fistula track, destroy the lining under direct vision, and close the internal opening — all without cutting the sphincter muscle. This preserves full continence." },
  { category: "Appointment", question: "How do I book an appointment?", answer: "Click 'Book Appointment' on this website, choose your preferred date and time slot, and fill in your details. Our care coordinator will call you within a few hours to confirm. You can also call the clinic directly." },
  { category: "Appointment", question: "Is online consultation available?", answer: "Yes. Dr. Vishva offers video consultations via a secure platform. This is ideal for initial assessment, follow-up visits, or if you are not in Vadodara. You will receive a prescription and detailed plan by email after the call." },
  { category: "Recovery", question: "How long does recovery take after laser?", answer: "Most patients return to desk work within 48 hours. Full recovery (no restrictions) is typically within 1–2 weeks. Physical labour jobs may require 1 week of rest. You will receive a personalised diet and activity plan on discharge." },
  { category: "Recovery", question: "Will piles come back after laser surgery?", answer: "Laser surgery has a very low recurrence rate (under 5%) compared to conventional methods. Following the post-procedure dietary advice, staying hydrated, and avoiding straining are the key factors that prevent recurrence." },
  { category: "General", question: "Is my consultation completely confidential?", answer: "Absolutely. All consultations — in-clinic and online — are strictly private. No information is shared with anyone. Our team is trained to handle every case with maximum discretion and empathy." },
  { category: "General", question: "What should I bring to my first appointment?", answer: "Bring any previous reports (ultrasound, proctoscopy, colonoscopy) if available, a list of medications you are currently taking, and your UHID/patient ID if you have visited before. For a first visit, nothing specific is needed — just come as you are." },
];

router.get("/", async (_, res) => {
  try {
    const count = await FAQ.countDocuments();
    if (count === 0) {
      await FAQ.insertMany(FALLBACK);
    }
    res.json(await FAQ.find().sort({ sort_order: 1 }));
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});
router.post("/",      protect, adminOnly, async (req, res) => { try { res.status(201).json(await FAQ.create(req.body)); } catch (e) { res.status(400).json({ detail: e.message }); } });
router.patch("/:id",  protect, adminOnly, async (req, res) => { const d = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true }); d ? res.json(d) : res.status(404).json({ detail: "Not found" }); });
router.delete("/:id", protect, adminOnly, async (req, res) => { try { await FAQ.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { res.status(500).json({ detail: e.message }); } });
export default router;
