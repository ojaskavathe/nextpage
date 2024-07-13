import { InnerNav } from "@/components/nav-inner";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expenses",
  description: "View Expenses.",
}

const expensesNavItems = [
  {
    title: "Expenses",
    href: "/expenses/add",
  },
  {
    title: "Petty Cash",
    href: "/expenses/report",
  },
  {
    title: "Summary",
    href: "/expenses/summary",
  },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let expenseNav = expensesNavItems;

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
        <p className="text-muted-foreground">
          Cash Expenses & Reports
        </p>
      </div>
      <div className="flex flex-col">
        <aside className="mb-4 flex space-x-4">
          <InnerNav navItems={expenseNav} />
        </aside>
        <Separator className="my-0" />
        <div className="mt-4 flex-1">{children}</div>
      </div>
    </div>
  )
}
