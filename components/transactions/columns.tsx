"use client"

import { prisma } from "@/server/db"
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
    header: "Reason for Adjustment",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return (<div>
        {date.toLocaleDateString("en-IN", { year: 'numeric', month: 'numeric', day: 'numeric' })}
      </div>)
    }
  }
]
