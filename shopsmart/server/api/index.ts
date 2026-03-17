import type { IncomingMessage, ServerResponse } from "http";
import app from "../src/app";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  // Express apps are compatible with Node request/response.
  // Vercel provides (req, res) for serverless functions.
  return app(req as any, res as any);
}

