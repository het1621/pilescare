import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ detail: "Email and password required" });
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ detail: "Invalid email or password" });
  }
  res.json({ token: signToken(user._id), user: { id: user._id, email: user.email, role: user.role } });
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
  res.json({ id: req.user._id, email: req.user.email, role: req.user.role });
});

export default router;
