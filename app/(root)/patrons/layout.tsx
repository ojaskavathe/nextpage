import { Metadata } from "next";

import { PatronNav } from "@/components/nav-patron";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Patrons",
  description: "Manage patrons.",
}

export default function PatronsLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Patrons</h2>
        <p className="text-muted-foreground">
          Sign-ups, Renewals, viewing and editing Patrons.
        </p>
      </div>
      <div className="flex flex-col">
        <aside className="mb-4">
          <PatronNav />
        </aside>
        <Separator className="my-0" />
        <div className="mt-4 flex-1">{children}</div>
      </div>
    </div>
  )
}