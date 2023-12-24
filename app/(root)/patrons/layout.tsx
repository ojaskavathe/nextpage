import { Metadata } from "next"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/patron-sidebar"

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const sidebarNavItems = [
  {
    title: "Patrons",
    href: "/patrons",
  },
  {
    title: "Sign-up",
    href: "/patrons/create",
  },
  {
    title: "Renew",
    href: "/patrons/renew",
  },
  {
    title: "Footfall",
    href: "/patrons/footfall",
  }
]

interface PatronsLayoutProps {
  children: React.ReactNode
}

export default function PatronsLayout({ children }: PatronsLayoutProps) {
  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Patrons</h2>
        <p className="text-muted-foreground">
          Sign-ups, Renewals, viewing and editing Patrons.
        </p>
      </div>
      <div className="flex flex-col">
        <aside className="-mx-4 mb-4">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <Separator className="my-0" />
        <div className="mt-8 flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}