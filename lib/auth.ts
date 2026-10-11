import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
        input: true,
      },
      lastName: {
        type: "string",
        required: true,
        input: true,
      },
      studentGroup: {
        type: "string",
        required: true,
        input: true,
      },
      birthDate: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },
});