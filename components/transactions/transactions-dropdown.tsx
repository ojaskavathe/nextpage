"use client";

import { MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Link from "next/link"

export function TransactionDropdown({ transactionId, admin = false }: { transactionId: number, admin?: boolean}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Link href={`/transactions/${transactionId}`}>
          <DropdownMenuItem>View</DropdownMenuItem>
        </Link>
        {!!admin &&
          <Link href={`/transactions/${transactionId}/edit`}>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
