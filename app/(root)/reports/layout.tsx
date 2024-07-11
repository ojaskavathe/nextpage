import { InnerNav } from "@/components/nav-inner";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description: "View Reports.",
}

const reportsNavItems = [
  {
    title: "Transactions",
    href: "/reports/transactions",
  },
  {
    title: "Footfall",
    href: "/reports/footfall",
  },
  {
    title: "Patrons",
    href: "/reports/patrons",
  },
  {
    title: "Followup",
    href: "/reports/followup",
  },
]

export default function ReportsLayout({ children }: { children: React.ReactNode }) {

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
          <InnerNav navItems={reportsNavItems} />
        </aside>
        <Separator className="my-0" />
        <div className="mt-4 flex-1">{children}</div>
      </div>
    </div>
  )
}
