import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type AccessPayload = {
  sub: string;
  email: string;
  role: string;
  type: "access";
};

export type RefreshPayload = {
  sub: string;
  jti: string;
  type: "refresh";
};

export function signAccessToken(payload: Omit<AccessPayload, "type">): string {
  return jwt.sign(
    { ...payload, type: "access" },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES }
  );
}

export function signRefreshToken(sub: string, jti: string): string {
  return jwt.sign(
    { sub, jti, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    { expiresIn: `${env.JWT_REFRESH_EXPIRES_DAYS}d` }
  );
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}

export function verifyRefreshToken(token: string): RefreshPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
}
