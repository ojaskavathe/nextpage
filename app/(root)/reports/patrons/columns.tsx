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
    size: 130,
  },
  {
    header: "Patron Name",
    accessorFn: (row) => {
      return row.name;
    },
    size: 150,
  },
  {
    header: " Joining Date",
    accessorFn: (row) => {
      const date: Date = row.joiningDate;
      return date.toLocaleString("en-IN", dateFormat);
    },
    sortingFn: "datetime",
  },
  {
    header: "Expiry Date",
    accessorFn: (row) => {
      const date: Date = row.subscription!.expiryDate;
      return date.toLocaleString("en-IN", dateFormat);
    },
    sortingFn: "datetime",
  },
  {
    header: "Plan",
    accessorFn: (row) => {
      return row.subscription!.plan;
    },
    size: 50,
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "altPhone",
    header: "Alternate Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 250,
  },
  {
    header: "Status",
    accessorFn: (row) => {
      if (row.subscription!.closed) {
        return "CLOSED"
      } else if (row.subscription!.expiryDate >= new Date()) {
        return "ACTIVE"
      }
      return "EXPIRED";
    },
  },
  {
    header: "Whatsapp",
    accessorFn: (row) => {
      const whatsapp: boolean = row.whatsapp;
      return whatsapp ? "Yes" : "No"
    },
  },
];
