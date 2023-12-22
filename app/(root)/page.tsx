import { auth } from "@/auth"

export default async function PatronDetails() {
  const session = await auth();

  return (
    <>
      name: {JSON.stringify(session?.user)}
    </>
  )
}
