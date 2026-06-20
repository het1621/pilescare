/**
 * Beautiful HTML email templates for appointment status notifications.
 * All templates use inline CSS for maximum email-client compatibility.
 */

const BRAND = {
  primary: "#1A5B5E",
  primaryLight: "#E8F4F4",
  accent: "#C9A96E",
  dark: "#1B2421",
  text: "#2D3B36",
  textMuted: "#6B7F77",
  white: "#FFFFFF",
  success: "#16A34A",
  successBg: "#F0FDF4",
  danger: "#DC2626",
  dangerBg: "#FEF2F2",
  completedBg: "#EFF6FF",
  completed: "#2563EB",
};

const CLINIC = {
  name: "ProctoCare by Vishva",
  address: "3rd Floor, Sterling Centre, Race Course Circle, Vadodara 390007",
  phone: "+91 99999 99999",
  bookingUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};

function baseLayout({ preheader, headerBg, headerColor, headerIcon, headerTitle, body }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${headerTitle}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F4F7F6;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;font-size:1px;color:#F4F7F6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${preheader}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F7F6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:${headerBg};padding:40px 40px 32px;text-align:center;">
              <div style="font-size:48px;line-height:1;margin-bottom:16px;">${headerIcon}</div>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:${headerColor};letter-spacing:-0.3px;">
                ${headerTitle}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px 40px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${BRAND.primaryLight};padding:24px 40px;border-top:1px solid rgba(26,91,94,0.08);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:${BRAND.primary};">${CLINIC.name}</p>
                    <p style="margin:0 0 4px;font-size:12px;color:${BRAND.textMuted};">${CLINIC.address}</p>
                    <p style="margin:0;font-size:12px;color:${BRAND.textMuted};">📞 ${CLINIC.phone}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom bar -->
          <tr>
            <td style="background:${BRAND.primary};padding:12px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.6);">
                This email was sent because you booked an appointment with ${CLINIC.name}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function appointmentDetailsCard(appt) {
  const rows = [
    { label: "Date", value: appt.preferred_date },
    { label: "Time", value: appt.time_slot },
    { label: "Type", value: appt.consultation_type === "online" ? "🖥️ Online Consultation" : "🏥 In-Clinic Visit" },
    { label: "Service", value: appt.service || "General Consultation" },
  ];

  const rowsHtml = rows.map(r => `
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:${BRAND.textMuted};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #F0F3F2;width:120px;">${r.label}</td>
      <td style="padding:10px 16px;font-size:14px;color:${BRAND.dark};font-weight:500;border-bottom:1px solid #F0F3F2;">${r.value}</td>
    </tr>
  `).join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAFCFB;border:1px solid rgba(26,91,94,0.1);border-radius:12px;overflow:hidden;margin:20px 0;">
      ${rowsHtml}
    </table>
  `;
}

// ─── CONFIRMED TEMPLATE ─────────────────────────────────────────────────────

export function confirmedEmailTemplate(appt) {
  const body = `
    <p style="margin:0 0 6px;font-size:15px;color:${BRAND.text};line-height:1.6;">
      Dear <strong>${appt.patient_name}</strong>,
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:${BRAND.text};line-height:1.6;">
      Great news! Your appointment has been <strong style="color:${BRAND.success};">confirmed</strong> by our team. Here are your appointment details:
    </p>

    ${appointmentDetailsCard(appt)}

    <!-- Preparation Tips -->
    <div style="background:${BRAND.primaryLight};border-radius:12px;padding:20px 24px;margin:24px 0;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:${BRAND.primary};">📋 Before Your Visit</p>
      <ul style="margin:0;padding-left:20px;font-size:13px;color:${BRAND.text};line-height:2;">
        <li>Please arrive <strong>10 minutes early</strong> for registration</li>
        <li>Bring any previous medical reports or prescriptions</li>
        <li>Carry a valid photo ID for verification</li>
        ${appt.consultation_type === "online" ? "<li>Ensure a stable internet connection for your video call</li>" : ""}
      </ul>
    </div>

    ${appt.admin_notes ? `
    <div style="background:#FFFBEB;border-left:4px solid ${BRAND.accent};border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:${BRAND.accent};text-transform:uppercase;letter-spacing:0.5px;">Note from the Doctor</p>
      <p style="margin:0;font-size:14px;color:${BRAND.text};line-height:1.5;">${appt.admin_notes}</p>
    </div>
    ` : ""}

    <p style="margin:24px 0 0;font-size:14px;color:${BRAND.textMuted};line-height:1.6;">
      If you need to reschedule or have any questions, please don't hesitate to contact us at <strong>${CLINIC.phone}</strong>.
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:${BRAND.text};line-height:1.6;">
      Warm regards,<br/>
      <strong style="color:${BRAND.primary};">Dr. Vishva Patel</strong><br/>
      <span style="font-size:12px;color:${BRAND.textMuted};">${CLINIC.name}</span>
    </p>
  `;

  return baseLayout({
    preheader: `Your appointment on ${appt.preferred_date} at ${appt.time_slot} has been confirmed!`,
    headerBg: BRAND.successBg,
    headerColor: BRAND.success,
    headerIcon: "✅",
    headerTitle: "Appointment Confirmed",
    body,
  });
}

// ─── CANCELLED TEMPLATE ─────────────────────────────────────────────────────

export function cancelledEmailTemplate(appt) {
  const body = `
    <p style="margin:0 0 6px;font-size:15px;color:${BRAND.text};line-height:1.6;">
      Dear <strong>${appt.patient_name}</strong>,
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:${BRAND.text};line-height:1.6;">
      We regret to inform you that your appointment has been <strong style="color:${BRAND.danger};">cancelled</strong>. We sincerely apologize for any inconvenience caused.
    </p>

    ${appointmentDetailsCard(appt)}

    ${appt.admin_notes ? `
    <div style="background:#FEF2F2;border-left:4px solid ${BRAND.danger};border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:${BRAND.danger};text-transform:uppercase;letter-spacing:0.5px;">Reason</p>
      <p style="margin:0;font-size:14px;color:${BRAND.text};line-height:1.5;">${appt.admin_notes}</p>
    </div>
    ` : ""}

    <p style="margin:20px 0;font-size:15px;color:${BRAND.text};line-height:1.6;">
      We'd love to see you soon! You can easily book a new appointment at a time that works best for you.
    </p>

    <!-- CTA Button -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
      <tr>
        <td style="background:${BRAND.primary};border-radius:12px;">
          <a href="${CLINIC.bookingUrl}/book" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:${BRAND.white};text-decoration:none;letter-spacing:0.3px;">
            📅 Book a New Appointment
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 0;font-size:14px;color:${BRAND.textMuted};line-height:1.6;">
      If you have any questions or concerns, please contact us at <strong>${CLINIC.phone}</strong>. We're here to help.
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:${BRAND.text};line-height:1.6;">
      Warm regards,<br/>
      <strong style="color:${BRAND.primary};">Dr. Vishva Patel</strong><br/>
      <span style="font-size:12px;color:${BRAND.textMuted};">${CLINIC.name}</span>
    </p>
  `;

  return baseLayout({
    preheader: `Your appointment on ${appt.preferred_date} has been cancelled. Book again easily!`,
    headerBg: BRAND.dangerBg,
    headerColor: BRAND.danger,
    headerIcon: "❌",
    headerTitle: "Appointment Cancelled",
    body,
  });
}

// ─── COMPLETED TEMPLATE ─────────────────────────────────────────────────────

export function completedEmailTemplate(appt) {
  const body = `
    <p style="margin:0 0 6px;font-size:15px;color:${BRAND.text};line-height:1.6;">
      Dear <strong>${appt.patient_name}</strong>,
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:${BRAND.text};line-height:1.6;">
      Thank you for visiting us! Your appointment has been marked as <strong style="color:${BRAND.completed};">completed</strong>. We hope your experience was comfortable and reassuring.
    </p>

    ${appointmentDetailsCard(appt)}

    ${appt.admin_notes ? `
    <div style="background:${BRAND.completedBg};border-left:4px solid ${BRAND.completed};border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:${BRAND.completed};text-transform:uppercase;letter-spacing:0.5px;">Doctor's Notes</p>
      <p style="margin:0;font-size:14px;color:${BRAND.text};line-height:1.5;">${appt.admin_notes}</p>
    </div>
    ` : ""}

    <!-- Post-Visit Tips -->
    <div style="background:${BRAND.primaryLight};border-radius:12px;padding:20px 24px;margin:24px 0;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:${BRAND.primary};">💡 Post-Visit Reminders</p>
      <ul style="margin:0;padding-left:20px;font-size:13px;color:${BRAND.text};line-height:2;">
        <li>Follow all prescribed medications and instructions</li>
        <li>Schedule a follow-up if recommended by the doctor</li>
        <li>Contact us immediately if you experience any concerns</li>
        <li>Maintain a healthy diet and lifestyle as advised</li>
      </ul>
    </div>

    <p style="margin:20px 0;font-size:15px;color:${BRAND.text};line-height:1.6;">
      Your health and recovery are our top priority. If you need a follow-up appointment, feel free to book one anytime.
    </p>

    <!-- CTA Button -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
      <tr>
        <td style="background:${BRAND.primary};border-radius:12px;">
          <a href="${CLINIC.bookingUrl}/book" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:${BRAND.white};text-decoration:none;letter-spacing:0.3px;">
            📅 Book Follow-Up Appointment
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 0;font-size:14px;color:${BRAND.textMuted};line-height:1.6;">
      For any questions about your treatment or recovery, reach out to us at <strong>${CLINIC.phone}</strong>.
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:${BRAND.text};line-height:1.6;">
      Wishing you a speedy recovery,<br/>
      <strong style="color:${BRAND.primary};">Dr. Vishva Patel</strong><br/>
      <span style="font-size:12px;color:${BRAND.textMuted};">${CLINIC.name}</span>
    </p>
  `;

  return baseLayout({
    preheader: `Thank you for visiting ${CLINIC.name}! Your appointment has been completed.`,
    headerBg: BRAND.completedBg,
    headerColor: BRAND.completed,
    headerIcon: "🎉",
    headerTitle: "Appointment Completed",
    body,
  });
}
