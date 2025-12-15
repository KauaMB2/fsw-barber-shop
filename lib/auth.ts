import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { env } from "./env";
import { prisma } from "./prisma";

export const auth = betterAuth({
  // motor de autenticação do betterAuth
  database: prismaAdapter(prisma, {
    provider: "postgresql", // Informa o banco de dados
  }),
  socialProviders: {
    // Configura as credenciais
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});
