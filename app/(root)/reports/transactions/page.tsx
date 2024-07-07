import { TransactionReportsTable } from "@/components/reports/transactions-reports-table";

import { columns } from "./columns";
import { fetchTransactions } from "@/server/reports";
import { auth } from "@/auth";

export default async function TransactionReport() {
  const transactions = await fetchTransactions();

  const session = await auth();

  return (
    <>
      <TransactionReportsTable
        admin={session?.user?.role == "ADMIN"}
        columns={columns}
        data={transactions!}
        pageSize={10}
      />
    </>
  )
}
