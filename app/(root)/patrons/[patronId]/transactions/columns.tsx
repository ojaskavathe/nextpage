"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

const dateTimeFormat: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: "numeric",
  minute: "numeric",
  timeZone: "Asia/Kolkata"
}

const dateFormat: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  timeZone: "Asia/Kolkata"
}

export const columns: ColumnDef<Transaction>[] = [
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
            <Link href={`/transactions/${transaction.id}/edit`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    accessorFn: ( row ) => {
      const date: Date = row.createdAt;
      return date.toLocaleString("en-IN", dateTimeFormat)
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "netPayable",
    header: "Net Payable",
  },
  {
    accessorKey: "readingFees",
    header: "Reading Fee"
  },
  {
    accessorKey: "discount",
    header: "Discount"
  },
  {
    accessorKey: "DDFees",
    header: "DD Fees"
  },
  {
    accessorKey: "registration",
    header: "Registration"
  },
  {
    accessorKey: "deposit",
    header: "Deposit"
  },
  {
    accessorKey: "adjust",
    header: "Adjust"
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "mode",
    header: "Mode",
  },
  {
    accessorKey: "oldPlan",
    header: "Old Plan"
  },
  {
    accessorKey: "newPlan",
    header: "New Plan",
  },
  {
    accessorKey: "oldExpiry",
    header: "Old Expiry",
    accessorFn: ( row ) => {
      if (!row.oldExpiry) {
        return
      }
      const date: Date = row.oldExpiry;
      return date.toLocaleDateString("en-IN", dateFormat)
    },
  },
  {
    accessorKey: "newExpiry",
    header: "New Expiry",
    accessorFn: ( row ) => {
      if (!row.newExpiry) {
        return
      }
      const date: Date = row.newExpiry;
      return date.toLocaleDateString("en-IN", dateFormat)
    },
  },
  {
    accessorKey: "offer",
    header: "Offer"
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  
]
