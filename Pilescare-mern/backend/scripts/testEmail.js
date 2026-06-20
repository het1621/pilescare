#!/usr/bin/env node
/**
 * Test script to verify SMTP email sending works.
 * Usage: node scripts/testEmail.js [recipient@email.com]
 *
 * If no recipient is provided, it sends to SMTP_USER (yourself).
 */
import "dotenv/config";
import { sendMail } from "../config/mailer.js";

const to = process.argv[2] || process.env.SMTP_USER;

console.log(`📧 Sending test email to: ${to}`);
console.log(`   Using SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
console.log(`   From: ${process.env.SMTP_USER}\n`);

const result = await sendMail({
  to,
  subject: "🧪 Test Email — ProctoCare by Vishva",
  html: `
    <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:480px;margin:40px auto;padding:32px;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.06);text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">✅</div>
      <h1 style="margin:0 0 8px;font-size:22px;color:#1A5B5E;">Email Setup Working!</h1>
      <p style="margin:0;font-size:14px;color:#6B7F77;">
        Your SMTP configuration is correctly set up.<br/>
        Appointment notification emails will work perfectly.
      </p>
      <div style="margin-top:24px;padding:16px;background:#E8F4F4;border-radius:10px;">
        <p style="margin:0;font-size:12px;color:#1A5B5E;font-weight:600;">ProctoCare by Vishva</p>
        <p style="margin:4px 0 0;font-size:11px;color:#6B7F77;">This is a test email — no action required.</p>
      </div>
    </div>
  `,
});

if (result.success) {
  console.log("✅ Test email sent successfully! Check your inbox.");
} else {
  console.error(`❌ Failed: ${result.error}`);
  process.exit(1);
}

process.exit(0);
