import { fetchPatrons } from "@/server/reports";
import { columns } from "./columns";
import { PatronReportsTable } from "@/components/reports/patron-reports-table";

export default async function PatronReport() {

  const patrons = await fetchPatrons();

  return (
    <>
      <PatronReportsTable
        columns={columns}
        data={patrons!}
        pageSize={10}
      />
    </>
  )
}
