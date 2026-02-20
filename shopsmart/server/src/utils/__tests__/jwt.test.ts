import { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } from "../jwt";
import type { AccessPayload, RefreshPayload } from "../jwt";

describe("jwt utils", () => {
  const accessPayload = { sub: "user-1", email: "u@test.com", role: "CUSTOMER" };
  const refreshSub = "user-1";
  const refreshJti = "jti-123";

  describe("signAccessToken / verifyAccessToken", () => {
    it("signs and verifies access token", () => {
      const token = signAccessToken(accessPayload);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);

      const decoded = verifyAccessToken(token) as AccessPayload;
      expect(decoded.sub).toBe(accessPayload.sub);
      expect(decoded.email).toBe(accessPayload.email);
      expect(decoded.role).toBe(accessPayload.role);
      expect(decoded.type).toBe("access");
    });

    it("throws on invalid token", () => {
      expect(() => verifyAccessToken("invalid")).toThrow();
    });
  });

  describe("signRefreshToken / verifyRefreshToken", () => {
    it("signs and verifies refresh token", () => {
      const token = signRefreshToken(refreshSub, refreshJti);
      expect(typeof token).toBe("string");

      const decoded = verifyRefreshToken(token) as RefreshPayload;
      expect(decoded.sub).toBe(refreshSub);
      expect(decoded.jti).toBe(refreshJti);
      expect(decoded.type).toBe("refresh");
    });

    it("throws on invalid token", () => {
      expect(() => verifyRefreshToken("invalid")).toThrow();
    });
  });
});
