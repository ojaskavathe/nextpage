"use client"

import { TransactionDropdown } from "@/components/transactions/transactions-dropdown";
import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

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

      return <TransactionDropdown transactionId={transaction.id} />;
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
