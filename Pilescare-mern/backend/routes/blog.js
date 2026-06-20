// ─── blog.js ─────────────────────────────────────────────────────────────────
import express from "express";
import BlogPost from "../models/BlogPost.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const FALLBACK = [
  { slug: "what-are-piles", category: "Symptoms", read_time: "6 min read", title: "What Are Piles? Symptoms, Causes, and When to See a Doctor", excerpt: "Piles (haemorrhoids) affect 1 in 3 adults at some point. Learn to recognise the signs early and understand why timely treatment makes all the difference.", cover: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80", content_html: "<p>Full article coming soon...</p>" },
  { slug: "laser-vs-surgery", category: "Treatment", read_time: "8 min read", title: "Laser Piles Treatment vs Traditional Surgery: What You Need to Know", excerpt: "Modern laser procedures have changed the game for piles treatment. Here's an evidence-based comparison of laser versus conventional surgical approaches.", cover: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80", content_html: "<p>Full article coming soon...</p>" },
  { slug: "fissure-fistula-diff", category: "Education", read_time: "5 min read", title: "Fissure vs Fistula: Understanding the Difference", excerpt: "Anal fissure and fistula are often confused. This guide explains what each condition is, how they feel, and why treatment is completely different.", cover: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80", content_html: "<p>Full article coming soon...</p>" },
  { slug: "diet-after-piles", category: "Recovery", read_time: "4 min read", title: "Best Diet After Piles Surgery: A Complete Recovery Guide", excerpt: "What you eat in the two weeks after laser piles surgery determines how fast and smoothly you recover. Here's a practical, easy-to-follow meal plan.", cover: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80", content_html: "<p>Full article coming soon...</p>" },
  { slug: "pilonidal-sinus", category: "Education", read_time: "5 min read", title: "Pilonidal Sinus: Causes, Symptoms, and Modern Treatment Options", excerpt: "Pilonidal sinus is common in young adults and frequently misunderstood. Learn about EPSIT — the minimally invasive treatment that avoids open wounds.", cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80", content_html: "<p>Full article coming soon...</p>" },
  { slug: "online-consult-tips", category: "Tips", read_time: "3 min read", title: "How to Prepare for Your Online Proctology Consultation", excerpt: "Getting the most out of a video consultation requires a little preparation. Here's exactly what to have ready so Dr. Vishva can help you effectively.", cover: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80", content_html: "<p>Full article coming soon...</p>" },
];

router.get("/", async (req, res) => {
  try {
    const count = await BlogPost.countDocuments();
    if (count === 0) {
      await BlogPost.insertMany(FALLBACK);
    }
    const posts = await BlogPost.find({ published: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});
router.get("/admin/all", protect, adminOnly, async (_, res) => {
  try {
    const count = await BlogPost.countDocuments();
    if (count === 0) {
      await BlogPost.insertMany(FALLBACK);
    }
    res.json(await BlogPost.find().sort({ createdAt: -1 }));
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});
router.get("/:slug",  async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
    if (!post) return res.status(404).json({ detail: "Post not found" });
    res.json(post);
  } catch (e) { res.status(500).json({ detail: e.message }); }
});
router.post("/",      protect, adminOnly, async (req, res) => { try { res.status(201).json(await BlogPost.create(req.body)); } catch (e) { res.status(400).json({ detail: e.message }); } });
router.patch("/:id",  protect, adminOnly, async (req, res) => {
  try {
    const p = await BlogPost.findById(req.params.id);
    if (!p) return res.status(404).json({ detail: "Not found" });
    Object.assign(p, req.body);
    await p.save();
    res.json(p);
  } catch (e) { res.status(400).json({ detail: e.message }); }
});
router.delete("/:id", protect, adminOnly, async (req, res) => { try { await BlogPost.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { res.status(500).json({ detail: e.message }); } });

export default router;
