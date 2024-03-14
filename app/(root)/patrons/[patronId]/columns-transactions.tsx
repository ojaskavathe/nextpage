"use client"

import { DDFees } from "@/lib/utils";
import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns_transactions: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "Details",
    accessorFn: (row) => {
      switch (row.type) {
        case "SIGNUP":
        case "RENEWAL":
          return `${row.newPlan} Books`
        case "DD":
          return `${row.DDFees / DDFees} DD`
      }
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
