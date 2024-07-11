"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  PatronWithSub,
  dateFormat,
  followupType,
  followupMessage,
  sr_id,
} from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<PatronWithSub & {type: followupType}>[] = [
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
    size: 120,
  },
  {
    header: "Patron Name",
    accessorFn: (row) => {
      return row.name;
    },
    size: 150,
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
    header: "In Hand",
    accessorFn: (row) => row.subscription!.booksInHand,
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
    accessorFn: (row) => row,
    cell: (row) => {
      const patron = row.getValue() as PatronWithSub & {type: followupType};
      const message = followupMessage(patron, patron.type);
      return (
        <div className="w-36 flex space-x-4 items-center justify-between">
          <div>{patron.phone}</div>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={encodeURI(
              `https://web.whatsapp.com/send?phone=+91${patron.phone}&text=${message}`,
            )}
          >
            {patron.whatsapp && (
              <Button
                className="font-semibold text-sm"
                variant="outline"
                size="sm"
              >
                <Image
                  src="/whatsapp.svg"
                  height={15}
                  width={15}
                  alt="Whatsapp"
                />
              </Button>
            )}
          </Link>
        </div>
      );
    },
    size: 180,
  },
  {
    header: "Alternate Mobile",
    accessorFn: (row) => row,
    cell: (row) => {
      const patron = row.getValue() as PatronWithSub & {type: followupType};
      const message = followupMessage(patron, patron.type);
      return (
        <>
          {patron.altPhone && (
            <div className="w-36 flex space-x-4 items-center justify-between">
              <div>{patron.altPhone}</div>
              {patron.whatsapp && (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={encodeURI(
                    `https://web.whatsapp.com/send?phone=+91${patron.altPhone}&text=${message}`,
                  )}
                >
                  <Button
                    className="font-semibold text-sm"
                    variant="outline"
                    size="sm"
                  >
                    <Image
                      src="/whatsapp.svg"
                      height={15}
                      width={15}
                      alt="Whatsapp"
                    />
                  </Button>
                </Link>
              )}
            </div>
          )}
        </>
      );
    },
    size: 180,
  },
];
