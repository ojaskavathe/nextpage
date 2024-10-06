"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { TransactionWithPatron, cn, sr_id } from "@/lib/utils";
import { CalendarIcon, Check, CircleAlert, Undo2 } from "lucide-react";
import Link from "next/link";

import { plans } from "@/lib/utils";

import jbwan from "../jbwan.png";
import Image from "next/image";
import { transactionSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { $Enums } from "@prisma/client";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { editTransaction } from "@/server/transaction";
import { useRouter } from "next/navigation";

const dateFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Kolkata",
};

export default function TransactionForm({
  transaction,
}: {
  transaction: TransactionWithPatron;
}) {
  const [isValidity, setIsValidity] = useState(!!transaction.newExpiry);
  const [isPlan, setIsPlan] = useState(!!transaction.newPlan);

  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      id: transaction.id,
      type: transaction.type,
      newPlan: transaction.newPlan,
      newExpiry: transaction.newExpiry,
      registration: transaction.registration,
      deposit: transaction.deposit,
      readingFees: transaction.readingFees,
      DDFees: transaction.DDFees,
      discount: transaction.discount,
      pastDues: transaction.pastDues,
      netPayable: transaction.netPayable,
      adjust: transaction.adjust,
      mode: transaction.mode,
      offer: transaction.offer || "",
    },
  });

  const { push } = useRouter();

  const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
    const res = await editTransaction(data);

    if (res.error) setErrorMessage(res.message);
    else {
      toast("Transaction Edited!");
      push(`/transactions/${transaction.id}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex space-x-4 my-4"
      >
        <div className="bg-white border border-black p-4 w-[400px] text-sm">
          <div className="flex flex-col items-center text-xl font-bold py-4">
            <Image src={jbwan} alt="SIMPLYREAD" height={100} />
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

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="col-span-2 flex items-center justify-between">
                  <FormLabel className="font-normal">Transaction For</FormLabel>
                  <Select defaultValue={`${field.value}`}>
                    <FormControl>
                      <SelectTrigger className="w-44">
                        <SelectValue placeholder="Transaction Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys($Enums.TransactionType).map((k, i) => (
                        <SelectItem value={`${k}`} key={i}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4 font-bold">Membership Number</div>
            <div className="mt-4">: {sr_id(transaction.patronId)}</div>

            <div className="font-bold">Name</div>
            <div className="">: {transaction.patron.name}</div>

            <FormField
              control={form.control}
              name="newPlan"
              render={({ field }) => (
                <FormItem className="col-span-2 flex items-center">
                  <FormLabel className="font-bold flex-1">
                    Reading Plan
                  </FormLabel>
                  <Select
                    onValueChange={(value: string) => {
                      form.setValue("newPlan", parseInt(value));
                    }}
                    defaultValue={field.value ? `${field.value}` : undefined}
                    disabled={!isPlan}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[8rem]">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plans.map((i) => (
                        <SelectItem value={`${i}`} key={i}>
                          {i} Book
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Toggle
                    variant="outline"
                    aria-label="Toggle plan"
                    className="justify-self-end ml-2"
                    defaultPressed={field.value ? true : false}
                    onPressedChange={(pressed) => {
                      if (!pressed) {
                        form.setValue("newPlan", null);
                      }
                      setIsPlan(pressed);
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </Toggle>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newExpiry"
              render={({ field }) => (
                <FormItem className="col-span-2 flex items-center text-red-700">
                  <FormLabel className="flex-1">Plan Validity:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="h-auto w-[8rem] py-2 px-3 text-sm"
                          disabled={!isValidity}
                        >
                          {field.value
                            ? field.value.toLocaleDateString(
                              "en-IN",
                              dateFormat,
                            )
                            : undefined}
                          <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        defaultMonth={field.value || undefined}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Toggle
                    variant="outline"
                    aria-label="Toggle plan"
                    className="justify-self-end ml-2"
                    defaultPressed={field.value ? true : false}
                    onPressedChange={(pressed) => {
                      if (!pressed) {
                        form.setValue("newExpiry", null);
                      } else {
                        form.setValue(
                          "newExpiry",
                          transaction.newExpiry || null,
                        );
                      }
                      setIsValidity(pressed);
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </Toggle>
                  <FormMessage />
                </FormItem>
              )}
            />

            <NumericInput
              control={form.control}
              name="registration"
              label="Registration Fees"
            />
            <NumericInput
              control={form.control}
              name="deposit"
              label="Refundable Deposit"
            />
            <NumericInput
              control={form.control}
              name="readingFees"
              label="Reading Fee"
            />
            <NumericInput
              control={form.control}
              name="DDFees"
              label="Door Delivery Fee"
            />
            <NumericInput
              control={form.control}
              name="discount"
              label="Discount"
            />
            <NumericInput
              control={form.control}
              name="pastDues"
              label="Past Overdue"
            />
            <NumericInput
              control={form.control}
              name="adjust"
              label="Adjustment"
            />
            <NumericInput
              control={form.control}
              name="netPayable"
              label="Net Payable"
            />

            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem className="col-span-2 flex items-center justify-between">
                  <FormLabel className="font-normal">Payment Mode</FormLabel>
                  <Select defaultValue={`${field.value}`}>
                    <FormControl>
                      <SelectTrigger className="w-44">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys($Enums.TransactionMode).map((k, i) => (
                        <SelectItem value={`${k}`} key={i}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offer"
              render={({ field }) => (
                <FormItem className="col-span-2 flex items-center justify-between">
                  <FormLabel className="font-normal">Offer</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-44 h-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

        <div className="flex flex-col space-y-4">
          <Button variant="secondary" type="submit">
            <Check size={16} />
          </Button>

          <Link href={`/transactions/${transaction.id}`}>
            <Button variant="secondary">
              <Undo2 size={16} />
            </Button>
          </Link>

          {errorMessage && (
            <div className={buttonVariants({ variant: "destructive" })}>
              <CircleAlert size={16} className="text-white" />
              {errorMessage}
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}

function NumericInput({
  control,
  name,
  label,
}: {
  control: any;
  name: string;
  label: any;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, ...fieldProps } }) => (
        <FormItem className="col-span-2 space-y-0 flex items-center justify-between">
          <FormLabel className="font-normal">{label}</FormLabel>
          <FormControl>
            <Input
              onChange={(e) => {
                // only allow integers
                if (e.target.value === "" || /^-?\d*$/.test(e.target.value)) {
                  onChange(e.target.value);
                }
              }}
              {...fieldProps}
              className="w-44 h-6"
              inputMode="numeric"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
