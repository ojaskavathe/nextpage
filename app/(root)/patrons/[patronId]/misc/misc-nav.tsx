"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Button,
  buttonVariants
} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

import { ChevronsUpDown } from "lucide-react";

export function MiscNav({ patronNavItems }: {
  patronNavItems: {
    title: string,
    href: string,
  }[]
}) {

  const pathname = usePathname()
  const currentTitle = patronNavItems.find(item => pathname.startsWith(item.href))?.title

  return (
    <>
      {/* desktop */}
      <nav
        className="
        hidden
        md:flex 
        justify-center space-x-2 mb-4 bg-secondary rounded-lg px-2"
      >
        {patronNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "justify-center my-1.5 flex-grow text-sm",
              (pathname.startsWith(item.href))
                ? "bg-white hover:bg-white shadow-sm"
                : "bg-transparent",
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      {/* mobile */}
      <nav
        className="
        block md:hidden
        mb-4 bg-secondary rounded-lg p-1"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild className={cn(
            buttonVariants({ variant: 'outline', size: "lg" }),
            "w-full justify-start p-2 flex-grow rounded-lg")
          }>
            <Button variant="ghost" className="flex justify-between items-center font-semibold">
              <span>{currentTitle}</span>
              <ChevronsUpDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-secondary" align="center" forceMount>
            {
              patronNavItems.map((item) => (
                <DropdownMenuItem
                  className="p-0"
                  key={item.title}
                  asChild>
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "justify-start w-full h-10 flex p-2 font-normal",
                      (pathname.startsWith(item.href))
                        ? "bg-white hover:bg-white shadow-sm"
                        : "bg-transparent",
                    )}
                  >
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))
            }

          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  )
}