import { PatronDetails } from "@/components/patron-details";
import { DataTable } from "@/components/transactions/transaction-data-table";

import { fetchPatron } from "@/server/patron";

import { columns } from "./columns";
import PatronUpdateForm from "./patron-update-form";

export default async function PatronPage({ params }: { params: { patronId: string } }) {

  const id = parseInt(params.patronId);
  const patron = await fetchPatron(id);

  return (
    <>
      <div className="flex mb-4 flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <PatronDetails patron={patron!} className="flex-1" />
        <DataTable
          columns={columns}
          data={patron!.transactions}
          patronId={patron!.id}
          className="flex-1" />
      </div>

      <PatronUpdateForm patron={patron!} />
    </>
  )
}
