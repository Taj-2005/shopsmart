import request from "supertest";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "OK" });
});

describe("GET /", () => {
  it("should return OK", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("OK");
  });
});
