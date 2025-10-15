import { defineConfig } from "drizzle-kit";
import { env } from "./config/env.js";

export default defineConfig({
  out: "./drizzle",
  schema: "./api/schema/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});