import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { verifyAccessToken, type AccessPayload } from "../utils/jwt";
import { AppError } from "./errorHandler";

export type AuthRequest = Request & {
  user?: { id: string; email: string; role: string; roleType: string };
};

export async function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    next(new AppError(401, "Authentication required", "UNAUTHORIZED"));
    return;
  }
  try {
    const payload = verifyAccessToken(token) as AccessPayload;
    const user = await prisma.user.findUnique({
      where: { id: payload.sub, active: true, deletedAt: null },
      include: { role: true },
    });
    if (!user) {
      next(new AppError(401, "User not found or inactive", "UNAUTHORIZED"));
      return;
    }
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role.id,
      roleType: user.role.name,
    };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token", "UNAUTHORIZED"));
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    next();
    return;
  }
  authenticate(req, res, next);
}
