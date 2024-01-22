import { PatronDetails } from "@/components/patron-details";
import { columns } from "@/components/transactions/columns";
import { DataTable } from "@/components/transactions/transaction-data-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { fetchPatron } from "@/server/patron";

import { MiscNav } from "./misc-nav";

export default async function PatronRenew({ params, children }: { params: { patronId: string }, children: React.ReactNode }) {

  const patron = await fetchPatron(parseInt(params.patronId));

  const patronNavItems = [
    {
      title: "DD",
      href: `/patrons/${params.patronId}/misc/dd`,
    },
    {
      title: "Addon",
      href: `/patrons/${params.patronId}/misc/addon`,
    },
    {
      title: "Deposit Refund",
      href: `/patrons/${params.patronId}/misc/refund`,
    },
    {
      title: "Book Lost",
      href: `/patrons/${params.patronId}/misc/lost`,
    },
    {
      title: "Other",
      href: `/patrons/${params.patronId}/misc/other`,
    },
  ]

  return (
    <>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
        <PatronDetails patron={patron!} className="flex-grow" readOnly={true} />
        <DataTable 
          columns={columns} 
          data={patron!.transactions} 
          patronId={patron!.id}
          className="flex-grow" />
      </div>
      <Card className="mt-8 xl:w-2/3">
        <CardHeader>
          <CardTitle>Miscellaneous</CardTitle>
        </CardHeader>
        <CardContent>
          <MiscNav patronNavItems={patronNavItems} />
          {children}
        </CardContent>
      </Card>
    </>
  )
}