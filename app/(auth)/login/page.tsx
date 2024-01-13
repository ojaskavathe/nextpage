import { auth } from "@/auth";
import { LoginForm } from "@/app/(auth)/login/login-form";
import { redirect } from "next/navigation";

export default async function LogIn() {
  const session = await auth();
  if (session) {
    redirect('/patrons')
  }

  return  (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-80 flex items-center justify-center border rounded-2xl">
        <LoginForm />
      </div>
    </div>
  )
}