import express from "express";
import { ServiceContent } from "../models/index.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let content = await ServiceContent.findOne();
    if (!content) {
      content = await ServiceContent.create({});
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.patch("/", protect, adminOnly, async (req, res) => {
  try {
    let content = await ServiceContent.findOne();
    if (!content) {
      content = await ServiceContent.create(req.body);
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
