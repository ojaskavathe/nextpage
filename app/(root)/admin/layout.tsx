import { auth } from "@/auth";
import { InnerNav } from "@/components/nav-inner";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description: "View Reports.",
}

const adminNavItems = [
  {
    title: "Transactions",
    href: "/admin/transactions",
  },
  {
    title: "Staff",
    href: "/admin/staff",
  },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  const session = await auth();

  if (session?.user?.role != "ADMIN") {
    return (
      <div>You are not authorized to be here!</div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          View Patron, Library and Lending Reports.
        </p>
      </div>
      <div className="flex flex-col">
        <aside className="mb-4">
          <InnerNav navItems={adminNavItems} />
        </aside>
        <Separator className="my-0" />
        <div className="mt-4 flex-1">{children}</div>
      </div>
    </div>
  )
}
