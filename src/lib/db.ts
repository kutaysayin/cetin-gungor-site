/* Prisma client singleton — tekli baglanti yonetimi */
import { PrismaClient } from "@/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import * as path from "path";

function resolveLibsqlUrl(url: string): string {
  if (url.startsWith("file:")) {
    const filePart = url.slice("file:".length);
    const absolutePath = path.resolve(filePart);
    return `file:${absolutePath}`;
  }
  return url;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  const adapter = new PrismaLibSql({ url: resolveLibsqlUrl(databaseUrl) });
  return new PrismaClient({ adapter }) as unknown as PrismaClient;
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
