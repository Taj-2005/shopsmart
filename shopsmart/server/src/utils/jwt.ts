import jwt, { type SignOptions } from "jsonwebtoken";
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

const ACCESS_EXPIRES_SECONDS = 3600; // 1h
function getRefreshExpiresSeconds(): number {
  return env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60;
}

export function signAccessToken(payload: Omit<AccessPayload, "type">): string {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRES_SECONDS };
  return jwt.sign(
    { ...payload, type: "access" },
    env.JWT_ACCESS_SECRET,
    options
  );
}

export function signRefreshToken(sub: string, jti: string): string {
  const options: SignOptions = { expiresIn: getRefreshExpiresSeconds() };
  return jwt.sign(
    { sub, jti, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    options
  );
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}

export function verifyRefreshToken(token: string): RefreshPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
}
