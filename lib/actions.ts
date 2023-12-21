"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export const authenticate = async (prevState: string | undefined, formData: FormData)  => {
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