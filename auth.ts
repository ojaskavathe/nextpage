import NextAuth, { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { LoginFormSchema } from "./lib/schema";
import { prisma } from "./server/db";
import { $Enums } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string,
    role: $Enums.Role
  }
}

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
        token.user = user as User;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user as { id: string, role: string };
      return session;
    },

    redirect: async ({ url, baseUrl }) => {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  
  },

  providers: [Credentials({
    credentials: {
      username: { label: "ID", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      const parsedCredentials = LoginFormSchema.safeParse(credentials);
      if (parsedCredentials.success) {
        const { username, password } = parsedCredentials.data;
        
        const user = await prisma.support.findFirst({
          where: {
            username,
            password
          }
        })
  
        if(!user) return null;
        return { id: user.username, role: user.role };
      }
      return null;
    },

  })],
  
  secret: process.env.AUTH_SECRET,

} satisfies NextAuthConfig

export const { handlers: {GET, POST}, auth, signIn, signOut } = NextAuth(authConfig)
