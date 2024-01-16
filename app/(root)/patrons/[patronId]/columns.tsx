"use client"

import { Transaction } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "newPlan",
    header: "Plan",
    cell: ({ row }) => {
      return `${row.getValue("newPlan")} Books`
    }
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
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: "numeric",
            minute: "numeric",
            timeZone: "UTC"
          })}
        </div>
      )
    }
  }
]
