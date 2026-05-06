#!/usr/bin/env node
// Run once: node scripts/createAdmin.js
import "dotenv/config";
import connectDB from "../config/db.js";
import User from "../models/User.js";

await connectDB();

const email = process.env.ADMIN_EMAIL || "admin@proctocarebyvishva.com";
const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

const existing = await User.findOne({ email });
if (existing) {
  console.log(`✅ Admin already exists: ${email}`);
  process.exit(0);
}

await User.create({ email, password, role: "admin" });
console.log(`✅ Admin created: ${email}`);
process.exit(0);
