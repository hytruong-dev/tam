import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Sử dụng DIRECT_URL hoặc DATABASE_URL từ môi trường
    url: process.env.DATABASE_URL || process.env.DIRECT_URL || "",
  },
});
