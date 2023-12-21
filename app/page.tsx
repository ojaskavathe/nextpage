import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()

  return (
    <>
      name: {JSON.stringify(session?.user)}
    </>
  )
}
