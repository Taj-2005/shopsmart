import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
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
