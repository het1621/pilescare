import express from "express";
import { Service } from "../models/index.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/",       async (_, res) => res.json(await Service.find().sort({ sort_order: 1 })));
router.post("/",      protect, adminOnly, async (req, res) => { try { res.status(201).json(await Service.create(req.body)); } catch (e) { res.status(400).json({ detail: e.message }); } });
router.patch("/:id",  protect, adminOnly, async (req, res) => { const s = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true }); s ? res.json(s) : res.status(404).json({ detail: "Not found" }); });
router.delete("/:id", protect, adminOnly, async (req, res) => { await Service.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });

export default router;
