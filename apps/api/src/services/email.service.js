import { env, isProd } from "../config/env.js";
import { OTP_PURPOSE, OTP_TTL_MS } from "../constants/auth.js";

const SUBJECTS = {
  [OTP_PURPOSE.VERIFY_EMAIL]: "Verify your ChartWars email",
  [OTP_PURPOSE.RESET_PASSWORD]: "Reset your ChartWars password",
};

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export async function sendOtpEmail({ to, name, code, purpose }) {
  if (!env.RESEND_API_KEY) {
    if (isProd) throw new Error("RESEND_API_KEY is not configured");
    console.log(`\n[DEV OTP] ${to} (${purpose}): ${code}\n`);
    return;
  }

  const minutes = OTP_TTL_MS / 60000;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [to],
      subject: SUBJECTS[purpose],
      text: `Hi ${name}, your ChartWars code is ${code}. It expires in ${minutes} minutes. If this wasn't you, ignore this email.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px">
          <h2 style="margin:0 0 12px">ChartWars</h2>
          <p>Hi ${escapeHtml(name)}, use this code to continue:</p>
          <p style="font-size:32px;letter-spacing:8px;font-weight:bold;margin:16px 0">${code}</p>
          <p style="color:#666">Expires in ${minutes} minutes. If this wasn't you, you can ignore this email.</p>
        </div>`,
    }),
  });

  if (!res.ok) throw new Error(`Email send failed: ${res.status} ${await res.text()}`);
}