"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { sr_id, TransactionWithSupport } from "@/lib/utils";

const dateFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Kolkata",
};

const timeFormat: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
  timeZone: "Asia/Kolkata",
};

export const columns: ColumnDef<TransactionWithSupport>[] = [
  {
    header: "Date",
    accessorFn: (row) => {
      const date: Date = row.createdAt;
      return date.toLocaleString("en-IN", dateFormat);
    },
    sortingFn: "datetime",
  },
  {
    header: "Time",
    accessorFn: (row) => {
      const date: Date = row.createdAt;
      return date.toLocaleString("en-IN", timeFormat);
    },
  },
  {
    header: "Staff",
    accessorFn: (row) => {
      return row.support.username;
    },
  },
  {
    header: "Patron",
    cell: ({ cell }) => {
      const patronId = cell.getValue() as number;
      return (
        <Link href={`/patrons/${patronId}`}>
          <Button className="font-semibold text-sm" variant="outline">
            {sr_id(cell.getValue() as number)}
          </Button>
        </Link>
      );
    },
    accessorFn: (row) => {
      return row.patron.id;
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
];
