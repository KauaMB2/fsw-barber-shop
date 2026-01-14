import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .url("DATABASE_URL deve ser uma URL válida")
    .refine(
      (url) => url.startsWith("postgresql://"),
      "DATABASE_URL deve começar com 'postgresql://'",
    ),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url("BETTER_AUTH_URL deve ser uma URL válida"),
  NEXT_PUBLIC_APP_URL: z.url("NEXT_PUBLIC_APP_URL deve ser uma URL válida"),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  OPENAI_API_KEY: z.string(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET_KEY: z.string(),
});

export const envServer = envSchema.parse(process.env);
