"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface navItem {
  title: string,
  href: string,
}

export function InnerNav({ navItems }: { navItems: navItem[] }) {
  const pathname = usePathname()

  return (
    <nav
      className={"flex md:justify-start md:space-x-2"}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            (pathname.startsWith(item.href))
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}