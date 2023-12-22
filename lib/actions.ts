"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/server/db";
import { AuthError } from "next-auth";
import { z } from "zod";

export const authenticate = async (prevState: string | undefined, formData: FormData) => {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid Credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    // throw error;
  }
}

export const Logout = async () => {
  await signOut()
}

export const fetchPatron = async (searchString: string) => {
  const isId = await z.string().regex(/^M\d+$/).safeParseAsync(searchString);
  if (isId.success) {
    return await prisma.patron.findMany({
      where: {
        id: {
          equals: parseInt(searchString.substring(1))
        }
      },
      take: 5
    });
  }

  // if not an ID, check name and email
  const v = await z.string().min(1).safeParseAsync(searchString);
  if (v.success) {
    return await prisma.patron.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchString,
              mode: "insensitive" // case-insensitive
            }
          },
          {
            email: {
              contains: searchString,
              mode: "insensitive"
            }
          }
        ]
      },
      take: 5
    });
  }
  return [];
}