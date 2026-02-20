import path from "path";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import swaggerSpec from "./config/swagger";

const SHOPSMART_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none">
  <circle cx="150" cy="150" r="150" fill="#00C2B2"/>
  <circle cx="150" cy="90" r="40" fill="#fff"/>
  <circle cx="125" cy="115" r="25" fill="#00C2B2"/>
  <rect x="125" y="100" width="50" height="100" rx="25" fill="#fff" transform="rotate(-15 150 150)"/>
  <circle cx="150" cy="210" r="40" fill="#fff"/>
  <circle cx="175" cy="185" r="25" fill="#00C2B2"/>
</svg>`;

const app = express();
const publicDir = path.join(__dirname, "..", "..", "public");

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests" },
  })
);
app.use(express.json({ limit: "10mb" }));
app.use("/", express.static(publicDir));
app.get("/icon.svg", (_req, res) => {
  res.type("image/svg+xml");
  res.set("Cache-Control", "public, max-age=86400");
  res.send(SHOPSMART_ICON_SVG);
});
app.get("/api-docs/icon.svg", (_req, res) => {
  res.type("image/svg+xml");
  res.set("Cache-Control", "public, max-age=86400");
  res.send(SHOPSMART_ICON_SVG);
});
app.use("/api", routes);
const swaggerOptions: swaggerUi.SwaggerUiOptions = {
  customSiteTitle: "ShopSmart API",
  customfavIcon: "/api-docs/icon.svg",
  swaggerOptions: {
    layout: "BaseLayout",
  },
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec as swaggerUi.JsonObject, swaggerOptions));
app.use(errorHandler);

export default app;
