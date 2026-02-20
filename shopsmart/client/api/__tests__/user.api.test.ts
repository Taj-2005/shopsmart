import { userApi } from "@/api/user.api";

describe("userApi", () => {
  it("exposes list, getById, update, delete, getOrders, getCart", () => {
    expect(typeof userApi.list).toBe("function");
    expect(typeof userApi.getById).toBe("function");
    expect(typeof userApi.update).toBe("function");
    expect(typeof userApi.delete).toBe("function");
    expect(typeof userApi.getOrders).toBe("function");
    expect(typeof userApi.getCart).toBe("function");
  });
});
