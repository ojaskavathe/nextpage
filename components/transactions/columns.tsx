"use client"

import { dateTimeFormat } from "@/lib/utils";
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
          {date.toLocaleString("en-IN", dateTimeFormat)}
        </div>
      )
    },
    sortingFn: "datetime"
  }
]
