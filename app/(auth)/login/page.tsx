import { redirect } from "next/navigation";

import { LoginForm } from "@/app/(auth)/login/login-form";
import { auth } from "@/auth";

export default async function LogIn({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string };
}) {

  const url = searchParams?.callbackUrl;

  const session = await auth();
  if (session) {
    redirect(url || '/patrons')
  }

  return  (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-80 flex items-center justify-center border rounded-2xl">
        <LoginForm callbackUrl={url}/>
      </div>
    </div>
  )
}