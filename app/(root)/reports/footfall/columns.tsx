"use client";

import { Button } from "@/components/ui/button";
import { FootfallWithPatron, dateFormat, sr_id, timeFormat } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<FootfallWithPatron>[] = [
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
    header: "Patron",
    accessorFn: (row) => {
      return row.patron.id;
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
      return row.patron.name;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "DD?",
    accessorFn: (row) => {
      return row.isDD ? "yes" : "";
    },
  },
  {
    accessorKey: "offer",
    header: "Offer",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    header: "Staff",
    accessorFn: (row) => {
      return row.support.username;
    },
    cell: (row) => {
      const support = row.getValue() as string;
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
