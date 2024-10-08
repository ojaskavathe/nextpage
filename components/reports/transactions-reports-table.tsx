"use client"

import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileDown
} from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import Link from "next/link";
import { TransactionDropdown } from "../transactions/transactions-dropdown";

interface DataTableProps<TData, TValue> {
  admin: boolean,
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  pageSize?: number,
  patronId?: number,
  className?: string
}

export function TransactionReportsTable<TData, TValue>({
  admin,
  columns,
  data,
  pageSize = 4,
  className
}: DataTableProps<TData, TValue>) {

  const [globalFilter, setGlobalFilter] = useState("")

  const globalFilterFn: FilterFn<TData> = (row, columnId, filterValue: string) => {
    const search = filterValue.toLowerCase();

    let value = row.getValue(columnId) as string;
    if (typeof value === 'number') value = String(value);

    return value?.toLowerCase().includes(search);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    initialState: {
      pagination: {
        pageSize: pageSize
      },
    },
    state: {
      globalFilter
    },
    defaultColumn: {
      size: 100,
      minSize: 10,
      maxSize: 300,
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between py-2">
        <div className="flex space-x-4 items-center">
          <div className="hidden md:block font-semibold text-xl">
            Transactions
          </div>
          <Input
            placeholder="Filter"
            value={globalFilter ?? ""}
            onChange={(event) =>
              setGlobalFilter(event.target.value)
            }
            className="max-w-sm"
          />
          <Link href="/api/export/transactions" className={buttonVariants({ variant: "default" })}>
            <FileDown className="h-5" />
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm px-2">{table.getState().pagination.pageIndex + 1}</span>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={cn("rounded-md border", className)}>
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead style={{width: "50px"}}></TableHead>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} style={{
                      width: header.getSize()
                    }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  <TableCell>
                    <TransactionDropdown transactionId={row.getValue("id")} admin={admin} />
                  </TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>


    </div>
  )
}
