import express from "express";
import { Testimonial } from "../models/index.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
router.get("/",       async (_, res) => res.json(await Testimonial.find({ visible: true }).sort({ createdAt: -1 })));
router.post("/",      protect, adminOnly, async (req, res) => { try { res.status(201).json(await Testimonial.create(req.body)); } catch (e) { res.status(400).json({ detail: e.message }); } });
router.patch("/:id",  protect, adminOnly, async (req, res) => { const d = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true }); d ? res.json(d) : res.status(404).json({ detail: "Not found" }); });
router.delete("/:id", protect, adminOnly, async (req, res) => { await Testimonial.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });
export default router;
