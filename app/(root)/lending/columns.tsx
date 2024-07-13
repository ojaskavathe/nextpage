"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { CheckoutWithPatron, sr_id } from "@/lib/utils";

const dateFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Kolkata",
};

export const columns: ColumnDef<CheckoutWithPatron>[] = [
  {
    header: "Patron",
    accessorFn: (row) => {
      return row.patronId;
    },
    cell: ({ cell }) => {
      const patronId = cell.getValue() as number;
      return (
        <Link href={`/patrons/${patronId}`}>
          <Button className="font-semibold text-sm" variant="outline">
            {sr_id(patronId)}
          </Button>
        </Link>
      );
    },
  },
  {
    header: "barcode",
    accessorFn: (row) => {
      return row.itemBarcode;
    },
    cell: ({ cell }) => {
      const itemBarcode = cell.getValue() as string;
      return itemBarcode;
    },
  },
  {
    header: "Patron Name",
    accessorFn: (row) => {
      return row.patron.name;
    },
    cell: ({ cell }) => {
      const patronName = cell.getValue() as string;
      return patronName;
    },
  },
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
