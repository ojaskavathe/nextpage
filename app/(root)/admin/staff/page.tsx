import { columns } from "./columns";
import { DataTable } from "@/components/table";
import { fetchSupports } from "@/server/staff";

export default async function AdminStaff() {

  const support = await fetchSupports();

  return (
    <>
      <DataTable
        columns={columns}
        data={support}
        pageSize={10}
      />
    </>
  )
}
