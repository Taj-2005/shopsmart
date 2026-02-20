import axios from "axios";
import { toApiError } from "@/api/axios";

describe("toApiError", () => {
  it("returns status and message from Axios error response", () => {
    const err = new Error("Request failed") as axios.AxiosError;
    err.response = {
      status: 400,
      data: { message: "Validation failed", code: "VALIDATION_ERROR" },
      statusText: "Bad Request",
      headers: {},
      config: {} as axios.InternalAxiosRequestConfig,
    };
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

    const result = toApiError(err);

    expect(result.status).toBe(400);
    expect(result.message).toBe("Validation failed");
    expect(result.code).toBe("VALIDATION_ERROR");
  });

  it("returns 500 and generic message for non-Axios error", () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValue(false);
    const result = toApiError(new Error("Something broke"));
    expect(result.status).toBe(500);
    expect(result.message).toBe("Request failed");
  });
});
