import { columns } from "./columns";
import { DataTable } from "@/components/table";
import { fetchSupport } from "@/server/staff";

export default async function AdminStaff() {

  const support = await fetchSupport();

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
