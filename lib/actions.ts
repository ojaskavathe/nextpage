"use server";

import { AuthError } from "next-auth";

import {
  signIn,
  signOut
} from "@/auth";

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
    throw error;
  }
}

export const Logout = async () => {
  await signOut()
}