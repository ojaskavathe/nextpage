import { auth } from "@/auth";
import { SupportCreateDialog } from "@/components/admin/support-form";
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
        <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
        <p className="text-muted-foreground">
          View staff and their actions
        </p>
      </div>
      <div className="flex flex-col">
        <aside className="mb-4 flex space-x-4">
          <InnerNav navItems={adminNavItems} />
          <SupportCreateDialog className="px-4"/>
        </aside>
        <Separator className="my-0" />
        <div className="mt-4 flex-1">{children}</div>
      </div>
    </div>
  )
}
