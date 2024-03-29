"use client";

import { Button } from "@/components/ui/button";
import { SupportFull } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<SupportFull>[] = [
  {
    header: "Username",
    accessorKey: "username",
    cell: ({ cell }) => {
      const username = cell.getValue() as string;
      return (
        <Link href={`/admin/staff/${username}`}>
          <Button className="font-semibold text-sm" variant="outline">
            {username}
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
