"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { sr_id } from "@/lib/utils";
import { Checkout } from "@prisma/client";

const dateFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Kolkata",
};

export const columns_lending: ColumnDef<Checkout>[] = [
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Authors",
    accessorKey: "authors",
  },
  {
    header: "Checked Out",
    accessorFn: (row) => {
      const date: Date = row.checked_out;
      return date.toLocaleString("en-IN", dateFormat);
    },
    sortingFn: "datetime",
  },
  {
    header: "Checked In",
    accessorFn: (row) => {
      if (!row.checked_in) {
        return;
      }
      const date: Date = row.checked_in;
      return date.toLocaleDateString("en-IN", dateFormat);
    },
  },
];
