import { auth } from "@/auth";
import { InnerNav } from "@/components/nav-inner";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description: "View Reports.",
}

const reportsNavItems = [
  {
    title: "Financial",
    href: "/summary/financial",
  },
]

export default async function ReportsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user?.role != "ADMIN") {
    return (
      <div>You are not authorized to be here!</div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Summary</h2>
        <p className="text-muted-foreground">
          Financial Summary
        </p>
      </div>
      <div className="flex flex-col">
        <aside className="mb-4">
          <InnerNav navItems={reportsNavItems} />
        </aside>
        <Separator className="my-0" />
        <div className="mt-4 flex-1">{children}</div>
      </div>
    </div>
  )
}
