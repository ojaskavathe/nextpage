"use client";

import { ColumnDef } from "@tanstack/react-table";

import { dateFormat, T_SummaryCount } from "@/lib/utils";

export const dailyColumns: ColumnDef<T_SummaryCount>[] = [
  {
    header: "Date",
    accessorFn: (row) => {
      const date: Date = row.createdAt;
      return date.toLocaleString("en-IN", dateFormat);
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "sum",
    header: "Amount",
    size: 50,
  },
];
