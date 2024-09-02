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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

import { patronRenewSchema } from "@/lib/schema";
import {
  DDFees,
  discounts,
  durations,
  fee,
  freeDDs,
  holidays,
  PatronFull,
  plans,
  sr_id,
} from "@/lib/utils";
import { renewPatron } from "@/server/patron";

import { AlertCircle, CalendarMinus, CalendarPlus } from "lucide-react";

export default function RenewForm({ patron }: { patron: PatronFull }) {
  const router = useRouter();

  const [plan, setPlan] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paidDD, setPaidDD] = useState(0);
  const [fromExpiry, setFromExpiry] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date();
  const oldExpiry = patron.subscription!.expiryDate;

  let numDays = 0;
  const isPatronLate =
    patron.subscription!.booksInHand > 0 && oldExpiry < today;
  if (isPatronLate) {
    numDays = Math.floor(
      (today.valueOf() - oldExpiry.valueOf()) / (1000 * 60 * 60 * 24),
    );
  }

  const lateFees = fromExpiry
    ? 0
    : plan
      ? Math.floor((fee[plan - 1] * numDays) / 30)
      : 0;
  const newExpiry = isPatronLate
    ? fromExpiry
      ? new Date(new Date(oldExpiry).setMonth(oldExpiry.getMonth() + duration))
      : new Date(today.setMonth(today.getMonth() + duration))
    : new Date(today.setMonth(today.getMonth() + duration))

  const readingFee = fee[plan - 1] * duration;

  const index = durations.indexOf(duration);
  const freeDD = index != -1 ? freeDDs[index] : 0;
  const freeHoliday = index != -1 ? holidays[index] : 0;
  const discount = index != -1 ? readingFee * discounts[index] : 0;

  const form = useForm<z.infer<typeof patronRenewSchema>>({
    resolver: zodResolver(patronRenewSchema),
    defaultValues: {
      id: patron.id,
      paidDD: "",
      adjust: "",
      reason: "",
      offer: "",
      remarks: "",
      renewFromExpiry: false,
    },
  });

  const adjustWatch = form.watch("adjust", "");

  const onSubmit = async (data: z.infer<typeof patronRenewSchema>) => {
    const res = await renewPatron(data);

    if (res.error == 0) {
      router.push(`/patrons/${data.id}`);
      toast.success(`Patron ${sr_id(data.id)} renewed successfully!`);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <Card className="mt-8 xl:w-2/3">
      <CardHeader>
        <CardTitle>Renew</CardTitle>
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
                        {oldExpiry < today && (
                          <SelectItem value={`0`}>Till Expiry</SelectItem>
                        )}
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
            <div className="flex items-center space-x-4">
              <div className="mt-4 flex-grow">
                <Label>Past Dues:</Label>
                <div className="mt-2 py-2 px-3 border rounded-md text-sm bg-secondary">
                  {lateFees}
                </div>
              </div>
              {!!plan && (
                <FormField
                  control={form.control}
                  name="renewFromExpiry"
                  render={({ field }) => (
                    <FormItem className="mt-12 flex flex-col items-center justify-center">
                      <FormControl>
                        <Toggle
                          variant="outline"
                          aria-label="Toggle late"
                          defaultPressed={field.value}
                          onPressedChange={(e) => {
                            field.onChange(e.valueOf());
                            setFromExpiry(e.valueOf());
                          }}
                          className="flex items-center justify-center space-x-2"
                          disabled={!isPatronLate}
                        >
                          {field.value ? (
                            <CalendarPlus className="w-4" />
                          ) : (
                            <CalendarMinus className="w-4" />
                          )}
                          <span className="hidden md:inline">
                            Renew From {field.value ? "Today" : "Expiry"}
                          </span>
                        </Toggle>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                {(!plan || !duration) && (
                  <CardDescription>
                    Enter Plan and Duration first!
                  </CardDescription>
                )}
              </CardHeader>
              {!!plan && duration >= 0 && (
                <>
                  <CardContent>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span>New Expiry:</span>
                        <span>
                          {newExpiry.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
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
                      {!!paidDD && (
                        <div className="flex items-center justify-between">
                          <span>DD Fees:</span>
                          <span>₹{paidDD * DDFees}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span>Discount:</span>
                        <span>- ₹{discount}</span>
                      </div>
                      {!!lateFees && (
                        <div className="flex items-center justify-between">
                          <span>Past Dues:</span>
                          <span>{`₹${lateFees}`}</span>
                        </div>
                      )}
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
                        {readingFee -
                          discount +
                          lateFees +
                          (paidDD ? paidDD * DDFees : 0) -
                          (adjustWatch!.toString() !== "-" ? -adjustWatch! : 0)}
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
              Renew
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
