"use client"

import { Transaction } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "netPayable",
    header: "Net Payable",
  },
  {
    accessorKey: "adjust",
    header: "Adjust Amount",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return (
        <div>
          {date.toLocaleString("en-IN", {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: "numeric",
            minute: "numeric",
            timeZone: "Asia/Kolkata"
          })}
        </div>
      )
    },
    sortingFn: "datetime"
  }
]
