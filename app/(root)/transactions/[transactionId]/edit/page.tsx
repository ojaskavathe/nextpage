import { fetchTransaction } from "@/server/transaction";
import TransactionForm from "./transactionForm";
import { auth } from "@/auth";

export default async function TransactionPage({
  params,
}: {
  params: { transactionId: string };
}) {
  const session = await auth();

  if (session?.user?.role != "ADMIN") {
    return (
      <div>You are not authorized to be here!</div>
    )
  }

  const id = parseInt(params.transactionId);
  const transaction = await fetchTransaction(id);

  return (
    <div className="mt-4 flex-1">
      <TransactionForm transaction={transaction!} />
    </div>
  );
}
