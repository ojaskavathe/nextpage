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

export const searchPatrons = async (searchString: string) => {
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

export const fetchPatron = async (patronId: number) => {
  const isId = await z.number().safeParseAsync(patronId);
  if (isId.success) {
    return await prisma.patron.findUnique({
      where: {
        id: patronId
      },
      include: {
        subscription: true,
        transactions: true
      }
    });
  }

  return null;
}