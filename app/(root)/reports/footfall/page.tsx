import { TransactionReportsTable } from "@/components/reports/transactions-reports-table";

import { fetchFootfall } from "@/server/reports";
import { columns } from "./columns";
import { FootfallReportsTable } from "@/components/reports/footfall-reports-table";

export default async function FootfallReport() {

  const footfall = await fetchFootfall();

  return (
    <>
      <FootfallReportsTable
        columns={columns}
        data={footfall!}
        pageSize={10}
      />
    </>
  )
}