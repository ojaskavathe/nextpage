"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SupportFull } from "@/lib/utils";
import { deleteSupport } from "@/server/staff";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export const columns: ColumnDef<SupportFull>[] = [
  {
    header: "Username",
    accessorKey: "username",
    cell: ({ cell }) => {
      const username = cell.getValue() as string;
      return (
        <Link href={`/admin/staff/${username}`}>
          <Button className="font-semibold text-sm" variant="outline">
            {username}
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    enableHiding: false,
    size: 50,
    cell: function Cell({ row }) {
      const support = row.original;
      const [open, setOpen] = useState(false);
      const [isPending, startTransition] = useTransition();

      const { refresh } = useRouter();

      function handleAction() {
        startTransition(async () => {
          await deleteSupport(support.id);
          refresh();
        });
      }

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DialogTrigger asChild>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Support</DialogTitle>
              <DialogDescription>
                This will transfer all associated transactions, footfall,
                expenses and reports over to legacy. Are you sure?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  handleAction();
                }}
                disabled={isPending}
                type="submit"
              >
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
