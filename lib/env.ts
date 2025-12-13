import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .url("DATABASE_URL deve ser uma URL válida")
    .refine(
      (url) => url.startsWith("postgresql://"),
      "DATABASE_URL deve começar com 'postgresql://'",
    ),
});

export const env = envSchema.parse(process.env);
