import "dotenv/config";
import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";
import { logger } from "./config/logger";

const server = app.listen(env.PORT, () => {
  logger.info(`Server listening on port ${env.PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    prisma.$disconnect();
    process.exit(0);
  });
});
