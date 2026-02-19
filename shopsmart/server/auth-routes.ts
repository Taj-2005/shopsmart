import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as store from "./auth-store";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? "shopsmart-dev-secret-change-in-production";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "shopsmart-refresh-dev-secret";
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";
const SALT_ROUNDS = 10;
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

function toPublicUser(u: store.StoredUser) {
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    role: u.role,
    avatarUrl: u.avatarUrl,
    createdAt: u.createdAt,
  };
}

function signAccess(payload: { sub: string; email: string; role: string }) {
  return jwt.sign(
    { ...payload, type: "access" },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
}

function signRefresh(payload: { sub: string }) {
  return jwt.sign(
    { ...payload, type: "refresh" },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );
}

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Full name, email and password are required" });
    }
    if (store.findByEmail(email)) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userRole = role === "admin_request" ? "customer" : (role ?? "customer");
    const user = store.createUser(email, fullName, passwordHash, userRole);
    const accessToken = signAccess({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = signRefresh({ sub: user.id });
    const expiresIn = 15 * 60; // 15 min in seconds
    return res.status(201).json({
      accessToken,
      refreshToken,
      expiresIn,
      user: toPublicUser(user),
    });
  } catch (e) {
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = store.findByEmail(email);
    if (!user || !user.active) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const accessToken = signAccess({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = signRefresh({ sub: user.id });
    const expiresIn = 15 * 60;
    return res.json({
      accessToken,
      refreshToken,
      expiresIn,
      user: toPublicUser(user),
    });
  } catch (e) {
    return res.status(500).json({ message: "Login failed" });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { sub: string; type: string };
    if (decoded.type !== "refresh") {
      return res.status(401).json({ message: "Invalid token" });
    }
    const user = store.findById(decoded.sub);
    if (!user || !user.active) {
      return res.status(401).json({ message: "User not found or inactive" });
    }
    const accessToken = signAccess({ sub: user.id, email: user.email, role: user.role });
    const expiresIn = 15 * 60;
    return res.json({
      accessToken,
      expiresIn,
      user: toPublicUser(user),
    });
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = store.findByEmail(email);
    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = Date.now() + RESET_TOKEN_EXPIRY_MS;
      store.saveResetToken(user.id, tokenHash, expiresAt);
      // In production: send email with link containing rawToken
      // For dev we could log it: console.log('Reset token (dev):', rawToken);
    }
    return res.json({
      message: "If an account exists with this email, you will receive a reset link.",
    });
  } catch (e) {
    return res.status(500).json({ message: "Request failed" });
  }
});

router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const userId = store.consumeResetToken(tokenHash);
    if (!userId) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }
    const user = store.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    return res.json({ message: "Password has been reset" });
  } catch (e) {
    return res.status(500).json({ message: "Reset failed" });
  }
});

export default router;
