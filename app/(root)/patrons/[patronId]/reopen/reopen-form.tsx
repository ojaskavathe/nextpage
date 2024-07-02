"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import TransactionDetails from "@/components/transaction-details";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { patronReopenSchema } from "@/lib/schema";
import {
  DDFees,
  discounts,
  durations,
  fee,
  freeDDs,
  holidays,
  PatronFull,
  plans,
  refundableDeposit,
  registrationFees,
  sr_id,
} from "@/lib/utils";
import { renewPatron, reopenPatron } from "@/server/patron";

import { AlertCircle } from "lucide-react";

export default function ReopenForm({ patron }: { patron: PatronFull }) {
  const router = useRouter();

  const [plan, setPlan] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paidDD, setPaidDD] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");

  const readingFee = fee[plan - 1] * duration;

  const index = durations.indexOf(duration);
  const freeDD = freeDDs[index];
  const freeHoliday = holidays[index];
  const discount = readingFee * discounts[index];

  const form = useForm<z.infer<typeof patronReopenSchema>>({
    resolver: zodResolver(patronReopenSchema),
    defaultValues: {
      id: patron.id,
      paidDD: "",
      adjust: "",
      reason: "",
      offer: "",
      remarks: "",
    },
  });

  const adjustWatch = form.watch("adjust", "");

  const onSubmit = async (data: z.infer<typeof patronReopenSchema>) => {
    const res = await reopenPatron(data);

    if (res.error == 0) {
      router.push(`/patrons/${data.id}`);
      toast.success(`Patron ${sr_id(data.id)} reopened successfully!`);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <Card className="mt-8 xl:w-2/3">
      <CardHeader>
        <CardTitle>Reopen</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Plan</FormLabel>
                    <Select
                      onValueChange={(value: string) => {
                        setPlan(parseInt(value));
                        field.onChange(parseInt(value));
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Duration</FormLabel>
                    <Select
                      onValueChange={(value: string) => {
                        setDuration(parseInt(value));
                        field.onChange(parseInt(value));
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {durations.map((i) => (
                          <SelectItem value={`${i}`} key={i}>
                            {i} Months
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
                name="paidDD"
                render={({ field: { onChange, ...fieldProps } }) => (
                  <FormItem className="w-full">
                    <FormLabel>Paid DD</FormLabel>
                    <FormControl>
                      <Input
                        onChange={(e) => {
                          // only allow integers
                          if (
                            e.target.value === "" ||
                            /^\d*$/.test(e.target.value)
                          ) {
                            setPaidDD(parseInt(e.target.value));
                            onChange(e.target.value);
                          }
                        }}
                        {...fieldProps}
                        className="mt-0"
                        placeholder="2"
                        inputMode="numeric"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <TransactionDetails form={form} />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Special Comment" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                {(!plan || !duration) && (
                  <CardDescription>
                    Enter Plan and Duration first!
                  </CardDescription>
                )}
              </CardHeader>
              {!!plan && !!duration && (
                <>
                  <CardContent>
                    <div>
                      {!!freeDD && (
                        <div className="mb-8">
                          <div className="flex items-center justify-between">
                            <span>Free DD:</span>
                            <span>{freeDD}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Free Subsciption Holidays:</span>
                            <span>{freeHoliday}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span>Reading Fees:</span>
                        <span>₹{readingFee}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Security Deposit:</span>
                        <span>₹{refundableDeposit}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Registration Fees:</span>
                        <span>₹{registrationFees}</span>
                      </div>
                      {!!paidDD && (
                        <div className="flex items-center justify-between">
                          <span>DD Fees:</span>
                          <span>₹{paidDD * DDFees}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span>Discount:</span>
                        <span>- ₹{readingFee * discounts[index]}</span>
                      </div>
                      {!!adjustWatch && adjustWatch.toString() !== "-" && (
                        <div className="flex items-center justify-between">
                          <span>Adjustment:</span>
                          <span>
                            {adjustWatch < 0
                              ? `- ₹${-adjustWatch}`
                              : `₹${adjustWatch}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full font-bold flex items-center justify-between">
                      <span>Total:</span>
                      <span>
                        ₹
                        {readingFee +
                          registrationFees +
                          refundableDeposit -
                          discount -
                          (adjustWatch!.toString() !== "-"
                            ? -adjustWatch!
                            : 0) -
                          (paidDD ? -(paidDD * DDFees) : 0)}
                      </span>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={form.formState.isSubmitting}
            >
              Reopen
            </Button>
          </form>
          {errorMessage && (
            <div className="flex text-red-500 mt-4">
              <AlertCircle className="mr-1 w-5" />
              <p className="font-semibold">{errorMessage}</p>
            </div>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}
