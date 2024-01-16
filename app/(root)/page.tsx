import { auth } from "@/auth";
import { DummyComponent } from "@/components/dummy";
import { redirect } from "next/navigation";

export default async function PatronDetails() {
  const session = await auth();
  if (session) {
    redirect('/patrons/search')
  }
}
