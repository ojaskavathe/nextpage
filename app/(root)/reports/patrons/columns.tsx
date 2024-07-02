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
    size: 70,
  },
  {
    header: "Patron Name",
    accessorFn: (row) => {
      return row.name;
    },
    size: 100,
  },
  {
    header: " Joining Date",
    accessorFn: (row) => {
      const date: Date = row.joiningDate;
      return date.toLocaleString("en-IN", dateFormat);
    },
    sortingFn: "datetime",
    size: 70,
  },
  {
    header: "Expiry Date",
    accessorFn: (row) => {
      const date: Date = row.subscription!.expiryDate;
      return date.toLocaleString("en-IN", dateFormat);
    },
    sortingFn: "datetime",
    size: 70,
  },
  {
    header: "Plan",
    accessorFn: (row) => {
      return row.subscription!.plan;
    },
    size: 30,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    size: 70,
  },
  {
    accessorKey: "altPhone",
    header: "Alternate Phone",
    size: 70,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 150,
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
    size: 50,
  },
  {
    accessorKey: "whatsapp",
    header: "Whatsapp",
    size: 70,
  },
];
