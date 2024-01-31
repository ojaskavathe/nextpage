import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library",
  description: "Manage Library.",
}

export default function PatronsLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Library</h2>
        <p className="text-muted-foreground">
          View and Edit Books, Magazine, Categories.
        </p>
      </div>
      <div className="flex flex-col">
        <Separator className="my-0" />
        <div className="mt-4 flex-1">{children}</div>
      </div>
    </div>
  )
}