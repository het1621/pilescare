import express from "express";
import { FAQ } from "../models/index.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
router.get("/",       async (_, res) => res.json(await FAQ.find().sort({ sort_order: 1 })));
router.post("/",      protect, adminOnly, async (req, res) => { try { res.status(201).json(await FAQ.create(req.body)); } catch (e) { res.status(400).json({ detail: e.message }); } });
router.patch("/:id",  protect, adminOnly, async (req, res) => { const d = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true }); d ? res.json(d) : res.status(404).json({ detail: "Not found" }); });
router.delete("/:id", protect, adminOnly, async (req, res) => { await FAQ.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });
export default router;
