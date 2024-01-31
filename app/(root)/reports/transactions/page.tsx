import { TransactionReportsTable } from "@/components/reports/transactions-reports-table";

import { columns } from "./columns";
import { fetchTransactions } from "@/server/reports";

export default async function TransactionReport() {

  const transactions = await fetchTransactions();

  return (
    <>
      <TransactionReportsTable
        columns={columns}
        data={transactions!}
        pageSize={10}
      />
    </>
  )
}