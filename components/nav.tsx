"use client"

import Link from "next/link"
import { ChevronDown, LucideIcon, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"

import { usePathname } from "next/navigation"
import { Logout } from "@/lib/actions"

interface NavProps {
  userId: string
  isCollapsed: boolean
}

export function Nav({ userId, isCollapsed }: NavProps) {

  const pathName = usePathname();

  const routes: {
    title: string,
    href: string,
    icon: LucideIcon,
    variant: "default" | "ghost"
  }[] = [
      {
        title: "Patrons",
        href: "/patrons",
        icon: Users,
        variant: pathName.startsWith('/patrons') ? "default" : "ghost",
      },
    ];

  return (
    <aside
      data-collapsed={isCollapsed}
      className="w-[250px] top-0 h-screen sticky px-4 bg-slate-100 group flex flex-col gap-4 py-6 data-[collapsed=true]:py-2"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild className={cn(
          buttonVariants({ variant: 'outline', size: "sm" }),
          "w-full justify-start py-2 px-2")
        }>
          <Button variant="ghost" className="flex">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback className="text-md bg-stone-300">{userId[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{userId}</span>
            <ChevronDown className="ml-auto"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full" align="end" forceMount>
          <DropdownMenuItem className="p-0">
            <form action={Logout} className="w-full">
              <Button variant={"ghost"} className="w-full h-8 flex justify-start p-2 font-normal">
                Log Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <nav className="grid gap-1 group-[[data-collapsed=true]]:px-2">
        {routes.map((route, index) =>
          <Link
            key={index}
            href={route.href}
            className={cn(
              buttonVariants({ variant: route.variant, size: "sm" }),
              route.variant === "default" && "dark:bg-muted dark:text-white",
              "justify-start"
            )}
          >
            <route.icon className="mr-2 h-4 w-4" />
            {route.title}
          </Link>
        )}
      </nav>
    </aside>
  )
}