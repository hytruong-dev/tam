import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  const adapter = connectionString ? new PrismaPg({ connectionString }) : undefined;
  return new PrismaClient({
    ...(adapter && { adapter }),
    log: [],
  });
}

// Lazy getter — chỉ tạo khi được gọi lần đầu, không chạy lúc module import
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Giữ backward compat cho code dùng `prisma` trực tiếp
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
