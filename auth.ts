import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";

import { prisma } from "./server/db";
import { LoginFormSchema } from "./lib/schema";

export const authConfig = {
  pages: {
    signIn: '/login'
  },

  session: {
    strategy: "jwt", 
    maxAge: 1 * 24 * 60 * 60
  },

  callbacks: {
    authorized: ({ auth, request: { nextUrl } }) => {
      return !!auth?.user;
    },
    
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user as { id: string };
      return session;
    },

  },

  providers: [Credentials({
    credentials: {
      id: { label: "ID", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      const parsedCredentials = LoginFormSchema.safeParse(credentials);
      if (parsedCredentials.success) {
        const { id, password } = parsedCredentials.data;
        
        const user = await prisma.support.findFirst({
          where: {
            id,
            password
          }
        })
  
        if(!user) return null;
        return { id: user.id };
      }
      return null;
    },

  })],
  
  secret: process.env.AUTH_SECRET,

} satisfies NextAuthConfig

export const { handlers: {GET, POST}, auth, signIn, signOut } = NextAuth(authConfig)