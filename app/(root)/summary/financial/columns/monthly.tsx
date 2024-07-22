"use client";

import { ColumnDef } from "@tanstack/react-table";

import { T_SummaryCount } from "@/lib/utils";

export const monthlyColumns: ColumnDef<T_SummaryCount>[] = [
  {
    header: "Date",
    accessorFn: (row) => {
      const date: Date = row.createdAt;
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        timeZone: "Asia/Kolkata",
      });
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "sum",
    header: "Amount",
    size: 50,
  },
];
