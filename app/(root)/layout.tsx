import { Nav } from "@/components/nav"
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <Nav
        userId={session?.user?.id || ''}
      />
      <div className="flex-grow pb-8 md:pb-0">{children}</div>
    </div>        
  )
}
