import { fetchTransaction } from "@/server/transaction";
import TransactionForm from "./transactionForm";

export default async function TransactionPage({
  params,
}: {
  params: { transactionId: string };
}) {
  const id = parseInt(params.transactionId);
  const transaction = await fetchTransaction(id);

  return (
    <div className="mt-4 flex-1">
      <TransactionForm transaction={transaction!} />
    </div>
  );
}
