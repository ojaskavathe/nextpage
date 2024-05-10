"use client";

import { Button } from "@/components/ui/button";
import { ExpenseWithSupport, dateTimeFormat } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<ExpenseWithSupport>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return (
        <div>
          {date.toLocaleDateString("en-IN", dateTimeFormat)}
        </div>
      );
    },
  },
  {
    header: "Category",
    accessorKey: "category",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Remarks",
    accessorKey: "remarks",
  },
  {
    header: "MODE",
    accessorKey: "mode",
  },
  {
    header: "Staff",
    accessorKey: "support",
    accessorFn: (row => {
      return row.support.username;
    }),
    cell: ({ cell }) => {
      const support = cell.getValue() as string;
      return (
        <Link href={`/admin/staff/${support}`}>
          <Button className="font-semibold text-sm" variant="outline">
            {support}
          </Button>
        </Link>
      );
    },
  },
];
