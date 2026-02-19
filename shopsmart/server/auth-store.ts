/**
 * In-memory auth store (no DB). Replace with DB in production.
 */

type UserRole = "customer" | "admin" | "super_admin";

export interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  passwordHash: string;
  avatarUrl?: string;
  createdAt: string;
  active: boolean;
}

export interface ResetTokenEntry {
  userId: string;
  tokenHash: string;
  expiresAt: number;
}

const users = new Map<string, StoredUser>();
const usersByEmail = new Map<string, string>();
const resetTokens = new Map<string, ResetTokenEntry>();

let idCounter = 1;

function nextId(): string {
  return String(idCounter++);
}

export function findByEmail(email: string): StoredUser | null {
  const id = usersByEmail.get(email.toLowerCase());
  return id ? users.get(id) ?? null : null;
}

export function findById(id: string): StoredUser | null {
  return users.get(id) ?? null;
}

export function createUser(
  email: string,
  fullName: string,
  passwordHash: string,
  role: UserRole
): StoredUser {
  const id = nextId();
  const createdAt = new Date().toISOString();
  const user: StoredUser = {
    id,
    email: email.toLowerCase(),
    fullName,
    role,
    passwordHash,
    createdAt,
    active: true,
  };
  users.set(id, user);
  usersByEmail.set(email.toLowerCase(), id);
  return user;
}

export function saveResetToken(userId: string, tokenHash: string, expiresAt: number): void {
  resetTokens.set(tokenHash, { userId, tokenHash, expiresAt });
}

export function consumeResetToken(tokenHash: string): string | null {
  const entry = resetTokens.get(tokenHash);
  if (!entry || Date.now() > entry.expiresAt) return null;
  resetTokens.delete(tokenHash);
  return entry.userId;
}

export function getAllUsers(): StoredUser[] {
  return Array.from(users.values());
}

export function updateUserRole(id: string, role: UserRole): boolean {
  const u = users.get(id);
  if (!u) return false;
  u.role = role;
  return true;
}

export function setUserActive(id: string, active: boolean): boolean {
  const u = users.get(id);
  if (!u) return false;
  u.active = active;
  return true;
}
