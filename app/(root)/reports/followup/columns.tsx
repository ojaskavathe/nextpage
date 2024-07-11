"use client";

import { Button } from "@/components/ui/button";
import { PatronWithSub, dateFormat, sr_id } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<PatronWithSub>[] = [
  {
    header: "Patron",
    accessorFn: (row) => {
      return row.id;
    },
    cell: (row) => {
      const patronid = row.getValue() as number;
      return (
        <Link href={`/patrons/${patronid}`}>
          <Button className="font-semibold text-sm" variant="outline">
            {sr_id(patronid)}
          </Button>
        </Link>
      );
    },
  },
  {
    header: "Patron Name",
    accessorFn: (row) => {
      return row.name;
    },
  },
  {
    header: "Expiry",
    accessorFn: (row) => {
      const date: Date = row.subscription!.expiryDate;
      return date.toLocaleString("en-IN", dateFormat);
    },
    sortingFn: "datetime",
  },
  {
    header: "Books In Hand",
    accessorFn: (row) => row.subscription!.booksInHand
  },
  {
    header: "Last Issued",
    accessorFn: (row) => {
      const date = row.subscription!.lastIssued;
      return date ? date.toLocaleString("en-IN", dateFormat) : null;
    },
  },
  {
    header: "Mobile",
    accessorKey: "phone",
  },
  {
    header: "Alternative Phone",
    accessorKey: "altPhone",
  },
];
