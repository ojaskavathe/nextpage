"use client";

import { Button } from "@/components/ui/button";
import { TransactionWithPatron, sr_id } from "@/lib/utils";
import { Clipboard } from "lucide-react";
import { useToBlob, useToPng } from "@hugocxl/react-to-image";
import Link from "next/link";

const dateFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Kolkata",
};

export default function Receipt({
  transaction,
}: {
  transaction: TransactionWithPatron;
}) {
  const [_, convert, ref] = useToBlob<HTMLDivElement>({
    onSuccess: (data) => {
      navigator.clipboard.write([
        new ClipboardItem({
          "image/png": data!,
        }),
      ]);
    },
  });

  return (
    <>
      <div className="flex space-x-4 my-4">
        <div
          className="bg-white border border-black p-4 w-[400px] text-sm"
          ref={ref}
        >
          <div className="flex flex-col items-center text-xl font-bold py-4">
            <div>Receipt</div>
          </div>
          <div className="font-bold">Contact Details:- </div>
          <div>Email: support@simplyread.in</div>
          <div>Phone: 020 41214771 / Whatsapp: +91 9527971342</div>

          <div className="grid grid-cols-2 gap-4 gap-y-1 mt-4">
            <div>Transaction Date</div>
            <div>
              : {transaction.createdAt.toLocaleDateString("en-IN", dateFormat)}
            </div>
            <div>Transaction ID</div>
            <div>: {transaction.id}</div>
            <div>Transaction for</div>
            <div>: {transaction.type}</div>

            <div className="mt-4 font-bold">Membership Number</div>
            <div className="mt-4">: {sr_id(transaction.patronId)}</div>

            <div className="font-bold">Name</div>
            <div className="">: {transaction.patron.name}</div>

            <div className="font-bold">Reading Plan</div>
            <div className="">: {transaction.newPlan} Book</div>

            <div className="font-bold text-red-700">Plan Validity</div>
            <div className="font-bold text-red-700">
              : {transaction.newExpiry?.toLocaleDateString("en-IN", dateFormat)}
            </div>

            <div className="mt-4">Registration Fees</div>
            <div className="mt-4">: {transaction.registration || ""}</div>

            <div>Refundable Deposit</div>
            <div>: {transaction.deposit || ""}</div>

            <div>Reading Fee</div>
            <div>: {transaction.readingFees || ""}</div>

            <div>Door Delivery Fee</div>
            <div>: {transaction.DDFees || ""}</div>

            <div>Discount</div>
            <div>: {transaction.discount || ""}</div>

            <div>Past Overdue</div>
            <div>: {transaction.pastDues || ""}</div>

            <div>Adjustment</div>
            <div>: {transaction.adjust || ""}</div>

            <div>Net Payable</div>
            <div>: {transaction.netPayable}</div>

            <div>Payment Mode</div>
            <div>: {transaction.mode || ""}</div>

            <div>Special Offer</div>
            <div>: {transaction.offer || ""}</div>
          </div>

          <div className="flex flex-col items-center mt-6 text-lg font-bold">
            <div>Thank you</div>
            <div>and Happy Reading!</div>
            <div className="text-md font-semibold text-blue-700 mt-4">
              Check out our collection at{" "}
              <Link href="https://simplyread.in" className="underline">
                simplyread.in
              </Link>
            </div>
          </div>
        </div>

        <div>
          <Button onClick={convert} variant="secondary">
            <Clipboard size={16} />
          </Button>
        </div>
      </div>
    </>
  );
}