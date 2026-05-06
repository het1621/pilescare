import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/auth.js";
import appointmentRoutes from "./routes/appointments.js";
import blogRoutes from "./routes/blog.js";
import serviceRoutes from "./routes/services.js";
import testimonialRoutes from "./routes/testimonials.js";
import faqRoutes from "./routes/faqs.js";
import settingsRoutes from "./routes/settings.js";
import contactRoutes from "./routes/contact.js";
import timeSlotRoutes from "./routes/timeSlots.js";

connectDB();

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for public endpoints
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
const strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, handler: (req, res) => res.status(429).json({ detail: 'Too many requests, please try again later.' }) });
app.use("/api/contact", strictLimiter);
app.use("/api", limiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/appointments",  appointmentRoutes);
app.use("/api/blog",          blogRoutes);
app.use("/api/services",      serviceRoutes);
app.use("/api/testimonials",  testimonialRoutes);
app.use("/api/faqs",          faqRoutes);
app.use("/api/clinic-settings", settingsRoutes);
app.use("/api/contact",       contactRoutes);
app.use("/api/time-slots",    timeSlotRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok", env: process.env.NODE_ENV }));

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ detail: "Route not found" }));

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    detail: err.message || "Internal server error",
  });
});

// ─── Vercel & Local Server Setup ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// Only listen actively if not in production (local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`));
}

// Export the Express API for Vercel's serverless functions
export default app;