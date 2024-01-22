import { PatronDetails } from "@/components/patron-details";
import { DataTable } from "@/components/transactions/transaction-data-table";

import { fetchPatron } from "@/server/patron";

import { columns } from "./columns";
import { wait } from "@/lib/utils";

export default async function PatronRenew({ params }: { params: { patronId: string } }) {

  const patron = await fetchPatron(parseInt(params.patronId));

  await wait();

  return (
    <>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 mb-2">
        <PatronDetails patron={patron!} className="w-full lg:w-2/3 2xl:w-1/2" readOnly={true} />
      </div>
      <DataTable
        columns={columns}
        data={patron!.transactions}
        pageSize={10}
        className="w-auto" />
    </>
  )
}