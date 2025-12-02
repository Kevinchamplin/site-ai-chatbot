import { PrismaClient } from "@/prisma-client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prismaClientInstance: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

export const prisma = prismaClientInstance;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
