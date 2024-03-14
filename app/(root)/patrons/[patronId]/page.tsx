import { PatronDetails } from "@/components/patron-details";
import { DataTable } from "@/components/transactions/transaction-data-table";

import { fetchPatron } from "@/server/patron";

import { columns_transactions } from "./columns-transactions";
import { columns_lending } from "./columns-lending";
import PatronUpdateForm from "./patron-update-form";
import { fetchCheckouts } from "@/server/reports";
import { LendingTable } from "@/components/lending-table";

export default async function PatronPage({
  params,
}: {
  params: { patronId: string };
}) {
  const id = parseInt(params.patronId);
  const patron = await fetchPatron(id);

  const checkouts = await fetchCheckouts(id);

  return (
    <>
      <div className="flex mb-4 flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <PatronDetails patron={patron!} className="basis-0 grow" />
        <DataTable
          columns={columns_transactions}
          data={patron!.transactions}
          patronId={patron!.id}
          className="basis-0 grow"
        />
      </div>

      <div className="flex mb-4 flex-col xl:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <PatronUpdateForm patron={patron!} className="basis-0 grow" />
        <LendingTable
          columns={columns_lending}
          data={checkouts}
          className="basis-0 grow"
        />
      </div>
    </>
  );
}
