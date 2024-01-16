import { PatronDetails } from "@/components/patron-details";
import { columns } from "@/components/transactions/columns";
import { DataTable } from "@/components/transactions/transaction-data-table";

import { fetchPatron } from "@/server/patron";

import RenewForm from "./renew-form";

export default async function PatronRenew({ params }: { params: { patronId: string } }) {

  const patron = await fetchPatron(parseInt(params.patronId));

  return (
    <>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
        <PatronDetails patron={patron!} className="flex-grow"/>
        <DataTable columns={columns} data={patron!.transactions} className="flex-grow" />
      </div>
      <RenewForm patron={patron!} />
    </>
  )
}