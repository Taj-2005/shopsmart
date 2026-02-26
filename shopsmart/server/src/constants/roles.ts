/**
 * Central role constants for RBAC. Use these in authorize() and documentation.
 * Add new roles here to scale.
 */
export const ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const ADMIN_ROLES: RoleType[] = [ROLES.ADMIN, ROLES.SUPER_ADMIN];

export const SUPER_ADMIN_ONLY: RoleType[] = [ROLES.SUPER_ADMIN];
