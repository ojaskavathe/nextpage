import { PatronDetails } from "@/components/patron-details";
import { DataTable } from "@/components/transactions/transaction-data-table";

import { fetchPatron } from "@/server/patron";

import ReopenForm from "./reopen-form";
import { columns_transactions } from "../columns-transactions";
import { redirect } from "next/navigation";

export default async function PatronReopen({
  params,
}: {
  params: { patronId: string };
}) {
  const patron = await fetchPatron(parseInt(params.patronId));

  if (!patron?.subscription!.closed) {
    redirect(`/patrons/${patron?.id}/renew`)
  }

  return (
    <>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
        <PatronDetails patron={patron!} className="flex-grow" readOnly={true} />
        <DataTable
          columns={columns_transactions}
          data={patron!.transactions}
          patronId={patron!.id}
          className="flex-grow"
        />
      </div>
      <ReopenForm patron={patron!} />
    </>
  );
}
