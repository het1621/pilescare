import nodemailer from "nodemailer";

// Create reusable transporter using SMTP env variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email. Fails gracefully — never throws.
 * @param {{ to: string, subject: string, html: string }} options
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function sendMail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"ProctoCare by Vishva" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to} — messageId: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Email failed to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

export default transporter;
