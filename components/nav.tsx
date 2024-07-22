"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import { Logout } from "@/lib/actions";
import { cn } from "@/lib/utils";

import {
  ArrowLeftRight,
  ChevronDown,
  FileSpreadsheet,
  HandCoins,
  Library,
  LogOut,
  LucideIcon,
  Menu,
  Pickaxe,
  Users,
} from "lucide-react";
import { $Enums } from "@prisma/client";

interface NavProps {
  userId: string;
  role: $Enums.Role;
}

export function Nav({ userId, role }: NavProps) {
  const pathName = usePathname();

  const routes: {
    title: string;
    href: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    auth: boolean;
  }[] = [
      {
        title: "Patrons",
        href: "/patrons",
        icon: Users,
        variant: pathName.startsWith("/patrons") ? "default" : "ghost",
        auth: false,
      },
      {
        title: "Library",
        href: "/library",
        icon: Library,
        variant: pathName.startsWith("/library") ? "default" : "ghost",
        auth: false,
      },
      {
        title: "Lending",
        href: "/lending",
        icon: ArrowLeftRight,
        variant: pathName.startsWith("/lending") ? "default" : "ghost",
        auth: false,
      },
      {
        title: "Reports",
        href: "/reports",
        icon: FileSpreadsheet,
        variant: pathName.startsWith("/reports") ? "default" : "ghost",
        auth: false,
      },
      {
        title: "Expenses",
        href: "/expenses",
        icon: HandCoins,
        variant: pathName.startsWith("/expenses") ? "default" : "ghost",
        auth: false,
      },
      {
        title: "Summary",
        href: "/summary",
        icon: HandCoins,
        variant: pathName.startsWith("/summary") ? "default" : "ghost",
        auth: true,
      },
    ];

  const [collaped, setCollapsed] = useState(true);
  const height = 360;

  return (
    <>
      {/* Mobile */}
      {!collaped && (
        <div className="fixed bottom-0 left-0 w-screen h-screen z-10"></div>
      )}
      <motion.div
        className="fixed bottom-0 left-0 w-full z-20"
        initial={{ y: height }}
        animate={{
          y: collaped ? height : 0,
        }}
        transition={{ ease: "easeOut" }}
      >
        <aside className="flex flex-col md:hidden fixed bottom-0 left-0 w-full items-center justify-center py-4 px-3 border-t-2 border-primary rounded-t-2xl bg-secondary overflow-hidden">
          <div className="w-full flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full justify-start py-2 px-2 flex-grow rounded-l-2xl",
                )}
              >
                <Button variant="ghost" className="flex">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className="text-md bg-stone-300">
                      {userId[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{userId}</span>
                  <ChevronDown className="ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width]"
                align="center"
                forceMount
              >
                <DropdownMenuItem className="p-0">
                  <form action={Logout} className="w-full">
                    <Button
                      variant={"ghost"}
                      className="w-full h-8 flex justify-start p-2 font-normal"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Log Out</span>
                    </Button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setCollapsed(!collaped)}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "rounded-r-2xl",
              )}
            >
              <Menu />
            </Button>
          </div>
          <Separator className="mt-4" />
          <nav className="grid gap-1 w-full mt-4">
            {routes.map(
              (route, index) =>
                (!route.auth || (route.auth && role == "ADMIN")) && (
                  <Link
                    key={index}
                    href={route.href}
                    className={cn(
                      route.auth && role !== "ADMIN" && "hidden",
                      buttonVariants({ variant: route.variant, size: "lg" }),
                      route.variant === "default" &&
                      "dark:bg-muted dark:text-white",
                      "justify-start",
                    )}
                    onClick={() => setCollapsed(true)}
                  >
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.title}
                  </Link>
                ),
            )}
            {role == "ADMIN" && (
              <Link
                href={"/admin"}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "dark:bg-muted dark:text-white",
                  "justify-start",
                )}
                onClick={() => setCollapsed(true)}
              >
                <Pickaxe className="mr-2 h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>
        </aside>
      </motion.div>

      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-[250px] top-0 h-screen sticky px-4 bg-slate-100 group gap-4 py-6 flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full justify-start py-2 px-2",
            )}
          >
            <Button variant="ghost" className="flex">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="text-md bg-stone-300">
                  {userId[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{userId}</span>
              <ChevronDown className="ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="center"
            forceMount
          >
            <DropdownMenuItem className="p-0 text-xs">
              <form action={Logout} className="w-full">
                <Button
                  variant={"ghost"}
                  className="w-full h-8 flex justify-start p-2 font-semibold"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log Out</span>
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator />
        <nav className="grid gap-1">
          {routes.map(
            (route, index) =>
              (!route.auth || (route.auth && role == "ADMIN")) && (
                <Link
                  key={index}
                  href={route.href}
                  className={cn(
                    buttonVariants({ variant: route.variant, size: "sm" }),
                    route.variant === "default" &&
                    "dark:bg-muted dark:text-white",
                    "justify-start",
                  )}
                >
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.title}
                </Link>
              ),
          )}
        </nav>
        {role == "ADMIN" && (
          <Link href="/admin" className="mt-auto">
            <Button
              variant={pathName.startsWith("/admin") ? "default" : "outline"}
              className="justify-start w-full"
            >
              <Pickaxe className="mr-2 h-4 w-4" />
              Admin
            </Button>
          </Link>
        )}
      </aside>
    </>
  );
}
