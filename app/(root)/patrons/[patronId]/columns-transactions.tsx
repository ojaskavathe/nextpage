"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DDFees } from "@/lib/utils";
import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const columns_transactions: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    header: "Details",
    accessorFn: (row) => {
      switch (row.type) {
        case "SIGNUP":
        case "RENEWAL":
          return `${row.newPlan} Books`;
        case "DD":
          return `${row.DDFees / DDFees} DD`;
      }
    },
  },
  {
    accessorKey: "netPayable",
    header: "Amount",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return (
        <div>
          {date.toLocaleDateString("en-IN", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
            timeZone: "Asia/Kolkata",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/transactions/${transaction.id}`}>
              <DropdownMenuItem>View</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
