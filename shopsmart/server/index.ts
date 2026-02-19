import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import authRoutes from "./auth-routes";
import * as authStore from "./auth-store";

if (authStore.getAllUsers().length === 0) {
  const hash = bcrypt.hashSync("Admin123!", 10);
  authStore.createUser("admin@shopsmart.test", "Super Admin", hash, "super_admin");
  console.log("Seeded default admin: admin@shopsmart.test / Admin123!");
}

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "ShopSmart API" });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
