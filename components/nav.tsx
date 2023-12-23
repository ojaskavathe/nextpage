"use client"

import Link from "next/link"
import { LucideIcon, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface NavProps {
  isCollapsed: boolean
}

const links: {
  title: string,
  href: string,
  icon: LucideIcon,
  variant: "default" | "ghost"
}[] = [
    {
      title: "Patrons",
      href: "/patrons",
      icon: Users,
      variant: "ghost",
    },
  ];

export function Nav({ isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="w-[200px] group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          <Link
            key={index}
            href="#"
            className={cn(
              buttonVariants({ variant: link.variant, size: "sm" }),
              link.variant === "default" && "dark:bg-muted dark:text-white",
              "justify-start"
            )}
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.title}
          </Link>
        )}
      </nav>
    </div>
  )
}