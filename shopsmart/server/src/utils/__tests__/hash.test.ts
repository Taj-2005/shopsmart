import { hashPassword, comparePassword, hashToken, generateToken } from "../hash";

describe("hash utils", () => {
  describe("hashPassword", () => {
    it("returns a hash different from plain text", async () => {
      const plain = "myPassword123";
      const hash = await hashPassword(plain);
      expect(hash).not.toBe(plain);
      expect(hash.length).toBeGreaterThan(50);
    });

    it("produces different hashes for same input (salt)", async () => {
      const plain = "same";
      const h1 = await hashPassword(plain);
      const h2 = await hashPassword(plain);
      expect(h1).not.toBe(h2);
    });
  });

  describe("comparePassword", () => {
    it("returns true for correct password", async () => {
      const plain = "secret123";
      const hash = await hashPassword(plain);
      const match = await comparePassword(plain, hash);
      expect(match).toBe(true);
    });

    it("returns false for wrong password", async () => {
      const hash = await hashPassword("correct");
      const match = await comparePassword("wrong", hash);
      expect(match).toBe(false);
    });
  });

  describe("hashToken", () => {
    it("returns hex string of fixed length", () => {
      const token = "some-token-value";
      const hashed = hashToken(token);
      expect(hashed).toMatch(/^[a-f0-9]+$/);
      expect(hashed.length).toBe(64);
    });

    it("same input produces same hash", () => {
      const token = "same";
      expect(hashToken(token)).toBe(hashToken(token));
    });
  });

  describe("generateToken", () => {
    it("returns hex string of expected length", () => {
      const t = generateToken();
      expect(t).toMatch(/^[a-f0-9]+$/);
      expect(t.length).toBe(64);
    });

    it("produces different tokens each time", () => {
      const t1 = generateToken();
      const t2 = generateToken();
      expect(t1).not.toBe(t2);
    });
  });
});
