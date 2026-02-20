import { authApi } from "@/api/auth.api";

describe("authApi", () => {
  it("exposes login, register, logout, refresh, me", () => {
    expect(typeof authApi.login).toBe("function");
    expect(typeof authApi.register).toBe("function");
    expect(typeof authApi.logout).toBe("function");
    expect(typeof authApi.refresh).toBe("function");
    expect(typeof authApi.me).toBe("function");
    expect(typeof authApi.forgotPassword).toBe("function");
    expect(typeof authApi.resetPassword).toBe("function");
  });
});
