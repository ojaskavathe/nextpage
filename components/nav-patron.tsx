"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const patronNavItems = [
  {
    title: "Patrons",
    href: "/patrons",
  },
  {
    title: "Sign-up",
    href: "/patrons/create",
  },
]

export function PatronNav() {
  const pathname = usePathname()

  return (
    <nav
      className={"flex md:justify-start md:space-x-2"}
    >
      {patronNavItems.map((item) => (
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