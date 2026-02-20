import { productApi } from "@/api/product.api";

describe("productApi", () => {
  it("exposes list, getById, getReviews, create, update, delete, getAnalytics", () => {
    expect(typeof productApi.list).toBe("function");
    expect(typeof productApi.getById).toBe("function");
    expect(typeof productApi.getReviews).toBe("function");
    expect(typeof productApi.create).toBe("function");
    expect(typeof productApi.update).toBe("function");
    expect(typeof productApi.delete).toBe("function");
    expect(typeof productApi.getAnalytics).toBe("function");
  });
});
