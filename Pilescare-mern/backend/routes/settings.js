// settings.js
import express from "express";
import { ClinicSettings } from "../models/index.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
router.get("/", async (_, res) => {
  let s = await ClinicSettings.findOne();
  if (!s) s = await ClinicSettings.create({});
  res.json(s);
});
router.put("/", protect, adminOnly, async (req, res) => {
  let s = await ClinicSettings.findOne();
  if (!s) s = new ClinicSettings();
  Object.assign(s, req.body);
  await s.save();
  res.json(s);
});
export default router;
