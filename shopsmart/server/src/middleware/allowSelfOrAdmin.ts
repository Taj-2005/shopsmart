import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate";
import { AppError } from "./errorHandler";
import { ADMIN_ROLES } from "../constants/roles";

/**
 * Allow access if the request is for the current user's own resource (param matches req.user.id)
 * or if the user has Admin/Super Admin role. Use for routes like GET/PATCH/DELETE /users/:id.
 * Role validation only — no scattered checks in controllers.
 */
export function allowSelfOrAdmin(paramName = "id") {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, "Authentication required", "UNAUTHORIZED"));
      return;
    }
    const resourceId = req.params[paramName];
    if (!resourceId) {
      next(new AppError(400, "Missing resource id", "VALIDATION_ERROR"));
      return;
    }
    const isOwn = resourceId === req.user.id;
    const isAdmin = ADMIN_ROLES.includes(req.user.roleType as (typeof ADMIN_ROLES)[number]);
    if (isOwn || isAdmin) {
      next();
      return;
    }
    next(new AppError(403, "Forbidden", "FORBIDDEN"));
  };
}
