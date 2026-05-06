// ─── blog.js ─────────────────────────────────────────────────────────────────
import express from "express";
import BlogPost from "../models/BlogPost.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/",       async (_, res) => res.json(await BlogPost.find({ published: true }).sort({ createdAt: -1 })));
router.get("/:slug",  async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
  if (!post) return res.status(404).json({ detail: "Post not found" });
  res.json(post);
});
router.get("/admin/all", protect, adminOnly, async (_, res) => res.json(await BlogPost.find().sort({ createdAt: -1 })));
router.post("/",      protect, adminOnly, async (req, res) => { try { res.status(201).json(await BlogPost.create(req.body)); } catch (e) { res.status(400).json({ detail: e.message }); } });
router.patch("/:id",  protect, adminOnly, async (req, res) => { const p = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true }); p ? res.json(p) : res.status(404).json({ detail: "Not found" }); });
router.delete("/:id", protect, adminOnly, async (req, res) => { await BlogPost.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });

export default router;
