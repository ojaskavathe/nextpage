"use client"

import { Button } from "@/components/ui/button";
import { FootfallWithPatron, TransactionWithPatron, sr_id } from "@/lib/utils";
import { Patron, Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ReactNode } from "react";

const dateTimeFormat: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: "numeric",
  minute: "numeric",
  timeZone: "Asia/Kolkata"
}

const dateFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: "Asia/Kolkata"
}

const timeFormat: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
  timeZone: "Asia/Kolkata"
}

export const columns: ColumnDef<FootfallWithPatron>[] = [
  {
    header: "Date",
    accessorFn: (row) => {
      const date: Date = row.createdAt;
      return date.toLocaleString("en-IN", dateFormat)
    },
    sortingFn: "datetime"
  },
  {
    header: "Time",
    accessorFn: (row) => {
      const date: Date = row.createdAt;
      return date.toLocaleString("en-IN", timeFormat)
    },
  },
  {
    accessorKey: "patron",
    header: "Patron",
    cell: (row) => {
      const patron = row.getValue() as Patron;
      return (
        <Button className="font-semibold text-sm" variant="outline">
          <Link href={`/patrons/${patron.id}`}>{sr_id(patron.id)}</Link>
        </Button>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "isDD",
    header: "DD?",
  },
  {
    accessorKey: "offer",
    header: "Offer",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },

]
