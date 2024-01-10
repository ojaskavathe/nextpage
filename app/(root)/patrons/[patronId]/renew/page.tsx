import { fetchPatron } from "@/server/patron";
import RenewForm from "./renew-form";
import { columns } from "@/components/transactions/columns";
import { DataTable } from "@/components/ui/data-table";
import { RenewPatronDetails } from "./patron-details";

export default async function PatronRenew({ params }: { params: { patronId: string } }) {

  const patron = await fetchPatron(parseInt(params.patronId));

  return (
    <>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
        <RenewPatronDetails patron={patron!} className="basis-1/2"/>
        <DataTable columns={columns} data={patron!.transactions} className="basis-1/2" />
      </div>
      <RenewForm patronId={patron!.id} />
    </>
  )
}