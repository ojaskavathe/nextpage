"use client";

import { dateFormat } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<{
  createdAt: Date;
  reportedCash: number;
  expenses: number;
  income: number;
  calculatedCash: number;
  diff: number;
}>[] = [
  {
    header: "Date",
    accessorFn: (row) => {
      const date: Date = row.createdAt;
      return date.toLocaleString("en-IN", dateFormat);
    },
    sortingFn: "datetime",
  },
  {
    header: "Reported Cash",
    accessorKey: "reportedCash",
  },
  {
    header: "Total Cash Expense",
    accessorKey: "expenses",
  },
  {
    header: "Total Cash Income",
    accessorKey: "income",
  },
  {
    header: "Calculated Petty Cash",
    accessorKey: "calculatedCash",
  },
  {
    header: "Diff",
    accessorKey: "diff",
    cell: (row) => {
      const diff = row.getValue() as number;

      return (
        <div
          className={
            diff < 0
              ? "text-red-700 font-bold"
              : diff > 0
                ? "text-blue-700"
                : ""
          }
        >
          {diff}
        </div>
      );
    },
  },
];
