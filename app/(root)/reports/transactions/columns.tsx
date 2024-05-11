"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { dateFormat, sr_id, timeFormat, TransactionWithPatron } from "@/lib/utils";

export const columns: ColumnDef<TransactionWithPatron>[] = [
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
    accessorFn: (row) => {
      return row.patronId;
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
    accessorKey: "netPayable",
    header: "Net Payable",
  },
  {
    accessorKey: "readingFees",
    header: "Reading Fee",
  },
  {
    accessorKey: "discount",
    header: "Discount",
  },
  {
    accessorKey: "DDFees",
    header: "DD Fees",
  },
  {
    accessorKey: "registration",
    header: "Registration",
  },
  {
    accessorKey: "deposit",
    header: "Deposit",
  },
  {
    accessorKey: "adjust",
    header: "Adjust",
  },
  {
    header: "Reason",
    accessorFn: (row) => {
      return row.reason ?? "";
    },
  },
  {
    accessorKey: "mode",
    header: "Mode",
  },
  {
    accessorKey: "oldPlan",
    header: "Old Plan",
  },
  {
    accessorKey: "newPlan",
    header: "New Plan",
  },
  {
    accessorKey: "oldExpiry",
    header: "Old Expiry",
    accessorFn: (row) => {
      if (!row.oldExpiry) {
        return;
      }
      const date: Date = row.oldExpiry;
      return date.toLocaleDateString("en-IN", dateFormat);
    },
  },
  {
    accessorKey: "newExpiry",
    header: "New Expiry",
    accessorFn: (row) => {
      if (!row.newExpiry) {
        return;
      }
      const date: Date = row.newExpiry;
      return date.toLocaleDateString("en-IN", dateFormat);
    },
  },
  {
    header: "Offer",
    accessorFn: (row) => {
      return row.offer ?? "";
    },
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    accessorFn: (row) => {
      return row.remarks ?? "";
    },
  },
  {
    accessorKey: "id",
    header: "ID",
  },
];
