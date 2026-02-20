import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? [{ emit: "event", level: "query" }, { emit: "stdout", level: "error" }]
        : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// @ts-expect-error Prisma query event
prisma.$on("query", (e: { query: string; duration: number }) => {
  logger.debug("query", { query: e.query, duration: e.duration });
});
