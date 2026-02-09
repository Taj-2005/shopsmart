import "dotenv/config";
import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "ShopSmart API" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
