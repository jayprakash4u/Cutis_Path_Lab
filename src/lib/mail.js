import nodemailer from "nodemailer";
import { escapeHtml } from "@/lib/htmlEscape";

function isMailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.BOOKING_NOTIFY_EMAIL,
  );
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function notifyAddress() {
  return process.env.CONTACT_NOTIFY_EMAIL || process.env.BOOKING_NOTIFY_EMAIL;
}

function fromAddress() {
  return process.env.SMTP_FROM || `Cutis Path Lab <${process.env.SMTP_USER}>`;
}

/**
 * Notify the lab of a new booking. Never throws — logs and returns false on failure
 * so booking save is never blocked by email issues.
 */
export async function sendBookingNotification(booking) {
  if (!isMailConfigured()) {
    console.warn(
      "[mail] SMTP not configured — skip booking email. Set SMTP_HOST, SMTP_USER, SMTP_PASS, BOOKING_NOTIFY_EMAIL.",
    );
    return { sent: false, reason: "not_configured" };
  }

  const to = process.env.BOOKING_NOTIFY_EMAIL;
  const from = fromAddress();

  const lines = [
    `New booking received`,
    ``,
    `Booking ID: ${booking.id}`,
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email || "—"}`,
    `Address: ${booking.address || "—"}`,
    `Preferred date: ${booking.preferredDate || "—"}`,
    `Preferred time: ${booking.preferredTime || "—"}`,
    `Test ID: ${booking.testId || "—"}`,
    `Package ID: ${booking.packageId || "—"}`,
    `Offer ID: ${booking.offerId || "—"}`,
    `Notes: ${booking.notes || "—"}`,
    `Status: pending`,
  ];

  const e = escapeHtml;

  try {
    const transport = createTransport();
    await transport.sendMail({
      from,
      to,
      subject: `New booking — ${booking.name} (${booking.phone})`,
      text: lines.join("\n"),
      html: `
        <h2 style="color:#3750A4;margin:0 0 12px;">New Booking</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Booking ID</td><td>${e(booking.id)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Name</td><td><strong>${e(booking.name)}</strong></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Phone</td><td>${e(booking.phone)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Email</td><td>${e(booking.email || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Address</td><td>${e(booking.address || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Date</td><td>${e(booking.preferredDate || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Time</td><td>${e(booking.preferredTime || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Test</td><td>${e(booking.testId || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Package</td><td>${e(booking.packageId || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Offer</td><td>${e(booking.offerId || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Notes</td><td>${e(booking.notes || "—")}</td></tr>
        </table>
      `,
    });
    return { sent: true };
  } catch (error) {
    console.error("[mail] Failed to send booking notification:", error);
    return { sent: false, reason: error.message };
  }
}

/**
 * Optional patient confirmation when they provided an email.
 */
export async function sendPatientBookingConfirmation(booking) {
  if (!booking.email) return { sent: false, reason: "no_patient_email" };
  if (!isMailConfigured()) return { sent: false, reason: "not_configured" };

  const from = fromAddress();
  const e = escapeHtml;

  try {
    const transport = createTransport();
    await transport.sendMail({
      from,
      to: booking.email,
      subject: "Booking received — Cutis Path Lab",
      text: [
        `Hello ${booking.name},`,
        ``,
        `We received your booking request.`,
        `Phone: ${booking.phone}`,
        `Preferred date: ${booking.preferredDate || "—"}`,
        `Preferred time: ${booking.preferredTime || "—"}`,
        `Details: ${booking.notes || "—"}`,
        ``,
        `Our team will contact you shortly to confirm.`,
        ``,
        `— Cutis Path Lab`,
      ].join("\n"),
      html: `
        <p>Hello <strong>${e(booking.name)}</strong>,</p>
        <p>We received your booking request.</p>
        <ul>
          <li>Phone: ${e(booking.phone)}</li>
          <li>Preferred date: ${e(booking.preferredDate || "—")}</li>
          <li>Preferred time: ${e(booking.preferredTime || "—")}</li>
          <li>Details: ${e(booking.notes || "—")}</li>
        </ul>
        <p>Our team will contact you shortly to confirm.</p>
        <p>— Cutis Path Lab</p>
      `,
    });
    return { sent: true };
  } catch (error) {
    console.error("[mail] Failed to send patient confirmation:", error);
    return { sent: false, reason: error.message };
  }
}

/**
 * Notify the lab of a new contact form message. Never throws.
 */
export async function sendContactNotification(message) {
  const to = notifyAddress();
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !to) {
    console.warn(
      "[mail] SMTP not configured — skip contact email. Set SMTP_* and BOOKING_NOTIFY_EMAIL or CONTACT_NOTIFY_EMAIL.",
    );
    return { sent: false, reason: "not_configured" };
  }

  const from = fromAddress();
  const e = escapeHtml;

  try {
    const transport = createTransport();
    await transport.sendMail({
      from,
      to,
      subject: `Contact form — ${message.subject || message.name}`,
      text: [
        `New contact message`,
        ``,
        `ID: ${message.id}`,
        `Name: ${message.name}`,
        `Email: ${message.email}`,
        `Phone: ${message.phone || "—"}`,
        `Subject: ${message.subject || "—"}`,
        ``,
        message.message,
      ].join("\n"),
      html: `
        <h2 style="color:#3750A4;margin:0 0 12px;">New Contact Message</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">ID</td><td>${e(message.id)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Name</td><td><strong>${e(message.name)}</strong></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Email</td><td>${e(message.email)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Phone</td><td>${e(message.phone || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Subject</td><td>${e(message.subject || "—")}</td></tr>
        </table>
        <p style="margin-top:16px;white-space:pre-wrap;font-family:sans-serif;font-size:14px;">${e(message.message)}</p>
      `,
    });
    return { sent: true };
  } catch (error) {
    console.error("[mail] Failed to send contact notification:", error);
    return { sent: false, reason: error.message };
  }
}
