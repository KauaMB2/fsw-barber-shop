import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { envServer } from "./env-server";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: envServer.GOOGLE_CLIENT_ID as string,
      clientSecret: envServer.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
