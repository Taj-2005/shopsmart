import { cartApi } from "@/api/cart.api";

describe("cartApi", () => {
  it("exposes get, add, updateItem, removeItem", () => {
    expect(typeof cartApi.get).toBe("function");
    expect(typeof cartApi.add).toBe("function");
    expect(typeof cartApi.updateItem).toBe("function");
    expect(typeof cartApi.removeItem).toBe("function");
  });
});
