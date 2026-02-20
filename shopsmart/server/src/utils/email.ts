import nodemailer from "nodemailer";
import { env } from "../config/env";
import { logger } from "../config/logger";

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    })
  : null;

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const link = `${env.FRONTEND_URL}/verify-email?token=${token}`;
  const html = `
    <p>Please verify your email by clicking the link below:</p>
    <p><a href="${link}">${link}</a></p>
    <p>This link expires in 24 hours.</p>
  `;
  await sendEmail(to, "Verify your ShopSmart email", html);
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <p><a href="${link}">${link}</a></p>
    <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
  `;
  await sendEmail(to, "Reset your ShopSmart password", html);
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!transporter) {
    logger.info("Email not sent (no SMTP)", { to, subject });
    return;
  }
  try {
    await transporter.sendMail({
      from: env.SMTP_FROM ?? "noreply@shopsmart.example.com",
      to,
      subject,
      html,
    });
  } catch (e) {
    logger.error("Email send failed", { to, subject, err: String(e) });
    // Do not throw: registration/login should succeed even if verification email fails
  }
}
