"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
  dateFormat,
  sr_id,
  timeFormat,
  TransactionWithSupport,
} from "@/lib/utils";
import { TransactionDropdown } from "@/components/transactions/transactions-dropdown";
import { Support } from "@prisma/client";

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
    header: "Patron",
    size: 120,
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
    size: 150,
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
    size: 50,
  },
  {
    accessorKey: "newPlan",
    header: "New Plan",
    size: 50,
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
    size: 50,
  },
  {
    header: "Staff",
    accessorKey: "support",
    cell: ({ cell }) => {
      const support = cell.getValue() as Support;
      return (
        <Link href={`/admin/staff/${support.username}`}>
          <Button className="font-semibold text-sm" variant="outline">
            {support.username}
          </Button>
        </Link>
      );
    },
  },
];
