import { TransactionReportsTable } from "@/components/reports/transactions-reports-table";

import { columns } from "./columns";
import { fetchTransactions } from "@/server/staff";

export default async function AdminTransactions() {

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
