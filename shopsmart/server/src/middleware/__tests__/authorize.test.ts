import { Response, NextFunction } from "express";
import { authorize } from "../authorize";
import type { AuthRequest } from "../authenticate";
import { AppError } from "../errorHandler";

function mockReq(user?: AuthRequest["user"]): AuthRequest {
  return { user } as AuthRequest;
}

function mockRes(): Partial<Response> {
  return {};
}

describe("authorize", () => {
  it("calls next() when user has allowed role", () => {
    const middleware = authorize("ADMIN", "SUPER_ADMIN");
    const req = mockReq({ id: "1", email: "a@b.com", role: "role-id", roleType: "ADMIN" });
    const res = mockRes() as Response;
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("calls next(403) when user role not allowed", () => {
    const middleware = authorize("ADMIN");
    const req = mockReq({ id: "1", email: "a@b.com", role: "role-id", roleType: "CUSTOMER" });
    const res = mockRes() as Response;
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = next.mock.calls[0][0] as AppError;
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe("FORBIDDEN");
  });

  it("calls next(401) when no user", () => {
    const middleware = authorize("ADMIN");
    const req = mockReq(undefined);
    const res = mockRes() as Response;
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = next.mock.calls[0][0] as AppError;
    expect(err.statusCode).toBe(401);
  });
});
