"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { cashReportSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { addCashReport } from "@/server/expenses";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface INotes {
  [key: string]: number;
}

function Count({
  amount,
  setNotes,
  setTotal,
}: {
  amount: number;
  setNotes: Dispatch<SetStateAction<INotes>>;
  setTotal: Dispatch<SetStateAction<number>>;
}) {
  const [num, setNum] = useState<string>('');

  return (
    <div className="flex space-x-2 items-center justify-between w-full basis-1/2">
      <Label className="basis-1/5">{amount}</Label>
      <Input
        className="basis-4/5"
        value={num}
        onChange={(e) => {
          // only allow integers
          const value = e.target.value.replace(/\D/g, "");
          setNum(value);
          if (/^\d*$/.test(e.target.value)) {
            setNotes((n) => {
              n[amount.toString()] = parseInt(e.target.value);
              setTotal(0);
              for (const note in n) {
                setTotal((t) => t + n[note] * parseFloat(note));
              }
              return n;
            });
          }
          if (e.target.value === "") {
            setNotes((n) => {
              n[amount.toString()] = 0;
              setTotal(0);
              for (const note in n) {
                setTotal((t) => t + n[note] * parseFloat(note));
              }
              return n;
            });
          }
        }}
        placeholder="0"
        inputMode="numeric"
      />
    </div>
  );
}

export default function CashReportForm({
  className,
}: {
  className: string;
}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof cashReportSchema>>({
    resolver: zodResolver(cashReportSchema),
    defaultValues: {
      amount: 5,
    },
  });

  const [notes, setNotes] = useState<INotes>({
    "2000": 0,
    "500": 0,
    "200": 0,
    "100": 0,
    "50": 0,
    "20": 0,
    "10": 0,
    "5": 0,
    "2": 0,
    "1": 0,
    "0.5": 0,
  });

  const [amount, setAmount] = useState(0);

  const onSubmit = async (_data: z.infer<typeof cashReportSchema>) => {
    if (amount == 0) {
      router.refresh();
      toast.warning('Non-zero amount required!');
      return;
    }

    const res = await addCashReport({
      amount: amount
    });

    if (res.error == 0) {
      router.refresh();
      toast.success(`Cash Report Added!`);
    } else {
      setErrorMessage(res.message);
    }
  };

  const rows = [];
  for (const note in notes) {
    rows.push(
      <Count
        amount={parseFloat(note)}
        setNotes={setNotes}
        setTotal={setAmount}
        key={note}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
          <div className="mt-4 grid grid-cols-2 items-center gap-4">{rows}</div>
          <div className="mt-4 ">
            <span className="font-bold">Total:</span> ₹{amount}
          </div>
          <Button
            type="submit"
            className="mt-6 w-full"
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Form>
      {errorMessage && (
        <div className="flex text-red-500 mt-4">
          <AlertCircle className="mr-1 w-5" />
          <p className="font-semibold">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
