import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate";
import { AppError } from "./errorHandler";

export function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, "Authentication required", "UNAUTHORIZED"));
      return;
    }
    if (!allowedRoles.includes(req.user.roleType)) {
      next(new AppError(403, "Forbidden", "FORBIDDEN"));
      return;
    }
    next();
  };
}
