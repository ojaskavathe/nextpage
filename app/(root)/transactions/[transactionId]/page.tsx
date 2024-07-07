import { fetchTransaction } from "@/server/transaction";
import Receipt from "./receipt";
import { auth } from "@/auth";

export default async function TransactionPage({
  params,
}: {
  params: { transactionId: string };
}) {
  const id = parseInt(params.transactionId);
  const transaction = await fetchTransaction(id);

  const session = await auth();

  return (
    <div className="mt-4 flex-1">
      <Receipt transaction={transaction!} admin={session?.user?.role == "ADMIN"} />
    </div>
  );
}
