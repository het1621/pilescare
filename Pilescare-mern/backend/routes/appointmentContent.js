import express from "express";
import { AppointmentContent } from "../models/index.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let content = await AppointmentContent.findOne();
    if (!content) {
      content = await AppointmentContent.create({});
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.patch("/", protect, adminOnly, async (req, res) => {
  try {
    let content = await AppointmentContent.findOne();
    if (!content) {
      content = await AppointmentContent.create(req.body);
    } else {
      Object.assign(content, req.body);
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

export default router;
