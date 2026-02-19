import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import { env } from "../../config/env";
import * as authService from "./auth.service";
import { AppError } from "../../middleware/errorHandler";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  path: "/",
};

function getRefreshTokenFromReq(req: AuthRequest): string | undefined {
  return req.body?.refreshToken ?? req.cookies?.[env.COOKIE_REFRESH_NAME];
}

export async function register(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, fullName, roleRequest } = req.body;
    const result = await authService.register({
      email,
      password,
      fullName,
      roleRequest,
    });
    res.cookie(env.COOKIE_REFRESH_NAME, result.refreshToken, COOKIE_OPTIONS);
    res.status(201).json({
      success: true,
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
      user: result.user,
    });
  } catch (e) {
    next(e);
  }
}

export async function login(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.login(req.body, req.ip);
    res.cookie(env.COOKIE_REFRESH_NAME, result.refreshToken, COOKIE_OPTIONS);
    res.json({
      success: true,
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
      user: result.user,
    });
  } catch (e) {
    next(e);
  }
}

export async function refresh(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = getRefreshTokenFromReq(req);
    if (!token) {
      next(new AppError(400, "Refresh token required", "BAD_REQUEST"));
      return;
    }
    const result = await authService.refresh(token);
    res.cookie(env.COOKIE_REFRESH_NAME, result.refreshToken, COOKIE_OPTIONS);
    res.json({
      success: true,
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
      user: result.user,
    });
  } catch (e) {
    next(e);
  }
}

export async function logout(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = getRefreshTokenFromReq(req);
    await authService.logout(token);
    res.clearCookie(env.COOKIE_REFRESH_NAME, { path: "/" });
    res.json({ success: true, message: "Logged out" });
  } catch (e) {
    next(e);
  }
}

export async function verifyEmail(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);
    res.json({ success: true, user: result.user });
  } catch (e) {
    next(e);
  }
}

export async function forgotPassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.json({ success: true, message: result.message });
  } catch (e) {
    next(e);
  }
}

export async function resetPassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.json({ success: true, message: "Password has been reset." });
  } catch (e) {
    next(e);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(new AppError(401, "Authentication required", "UNAUTHORIZED"));
      return;
    }
    const user = await authService.me(req.user.id);
    res.json({ success: true, user });
  } catch (e) {
    next(e);
  }
}
