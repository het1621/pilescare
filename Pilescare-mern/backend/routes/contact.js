import express from "express";
import { Contact } from "../models/index.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const msg = await Contact.create(req.body);
    res.status(201).json({ message: "Message received", id: msg._id });
  } catch (e) { res.status(400).json({ detail: e.message }); }
});
router.get("/", protect, adminOnly, async (_, res) => res.json(await Contact.find().sort({ createdAt: -1 })));
router.patch("/:id/read", protect, adminOnly, async (req, res) => {
  const d = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  res.json(d);
});
export default router;
