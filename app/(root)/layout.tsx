import { Nav } from "@/components/nav"
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <div className="flex">
      <Nav
        userId={session?.user?.id || ''}
        isCollapsed={false}
      />
      <div className="flex-grow">{children}</div>
    </div>        
  )
}
