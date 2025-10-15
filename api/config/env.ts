import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    BOT_TOKEN: z.string().optional(),
    DATABASE_URL: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
})
export const env = envSchema.parse(process.env);