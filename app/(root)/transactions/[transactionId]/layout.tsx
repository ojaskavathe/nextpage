import { fetchTransaction } from "@/server/transaction";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";

export default async function TransactionLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { transactionId: string };
}) {
  const id = parseInt(params.transactionId);
  if (!z.number().safeParse(id).success) {
    return (
      <div className="text-3xl font-medium">
        Invalid ID: <span className="font-bold">{params.transactionId}</span>
      </div>
    );
  }

  const transaction = await fetchTransaction(id);

  if (!transaction) {
    return (
      <div className="text-3xl font-medium">
        No transaction with ID: <span className="font-bold">{id}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Transaction</h2>
        <p className="text-muted-foreground">
          Edit Transactions and View Receipts
        </p>
      </div>
      <div className="flex flex-col">
        <Separator className="my-0" />
        <div className="mt-4 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
