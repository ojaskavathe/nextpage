import { fetchTransaction } from "@/server/transaction";
import Receipt from "./receipt";

export default async function TransactionPage({
  params,
}: {
  params: { transactionId: string };
}) {
  const id = parseInt(params.transactionId);
  const transaction = await fetchTransaction(id);

  return (
    <div className="mt-4 flex-1">
      <Receipt transaction={transaction!} />
    </div>
  );
}
