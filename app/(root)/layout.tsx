import { Nav } from "@/components/nav";

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
        role={session?.user?.role || "NON_ADMIN"}
      />
      <div className="flex-grow pb-8 md:pb-0 p-6 overflow-x-hidden">{children}</div>
    </div>        
  )
}
