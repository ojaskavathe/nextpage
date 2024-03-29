"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Toggle } from "@/components/ui/toggle";

import { patronMiscAddonSchema } from "@/lib/schema";
import { addonFee, dateFormat, durations, fee, PatronWithSub, plans } from "@/lib/utils";

import { AlertCircle, CalendarMinus, CalendarPlus } from "lucide-react";

export default function MiscAddonForm({ patron }: { patron: PatronWithSub }) {
  const [addonPlan, setAddonPlan] = useState(0);
  const [addonDuration, setAddonDuration] = useState(0);
  const [tillExpiry, setTillExpiry] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date();
  const planExpiry = patron.subscription!.expiryDate;

  const addonExpiry = tillExpiry
    ? patron.subscription!.expiryDate
    : new Date(today.setMonth(today.getMonth() + addonDuration));

  let numDays = 0;
  const isPlanValid = planExpiry > today;
  if (isPlanValid) {
    numDays = Math.floor(
      (planExpiry.valueOf() - today.valueOf()) / (1000 * 60 * 60 * 24),
    );
  }

  const addonFees = Math.ceil(
    tillExpiry
      ? (numDays * addonFee * addonPlan) / 30
      : addonDuration * addonFee * addonPlan,
  );

  const form = useForm<z.infer<typeof patronMiscAddonSchema>>({
    resolver: zodResolver(patronMiscAddonSchema),
    defaultValues: {
      id: patron.id,
      adjust: "",
      reason: "",
      offer: "",
      remarks: "",
      tillExpiry: false,
    },
  });

  const adjustWatch = form.watch("adjust", "");

  const onSubmit = async (data: z.infer<typeof patronMiscAddonSchema>) => {
    console.log(data);

    // if (res.error == 0) {
    //   router.push(`/patrons/${patron.id}`);
    //   toast.success(`Patron ${sr_id(data.id)} renewed successfully!`);
    // } else {
    //   setErrorMessage(res.message)
    // }
  };

  return isPlanValid ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem className="w-full sm:basis-2/5">
                <FormLabel>Plan</FormLabel>
                <Select
                  onValueChange={(value: string) => {
                    setAddonPlan(parseInt(value));
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

          <div className="w-full sm:basis-3/5 flex space-x-4">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="flex-grow sm:basis-2/3">
                  <FormLabel>Duration</FormLabel>
                  <Select
                    onValueChange={(value: string) => {
                      setAddonDuration(parseInt(value));
                      field.onChange(parseInt(value));
                    }}
                    disabled={tillExpiry}
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
              name="tillExpiry"
              render={({ field }) => (
                <FormItem className="mt-8 sm:basis-1/3 flex flex-col items-center justify-center">
                  <FormControl>
                    <Toggle
                      variant="outline"
                      aria-label="Toggle late"
                      defaultPressed={field.value}
                      onPressedChange={(e) => {
                        field.onChange(e.valueOf());
                        setTillExpiry(e.valueOf());
                      }}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      {field.value ? (
                        <CalendarPlus className="w-4" />
                      ) : (
                        <CalendarMinus className="w-4" />
                      )}
                      <span className="hidden md:inline">TillExpiry</span>
                    </Toggle>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
            {(!!addonDuration || tillExpiry) && !!addonPlan && (
              <CardDescription>Select Plan and Duration First!</CardDescription>
            )}
          </CardHeader>
          {(!!addonDuration || tillExpiry) && !!addonPlan && (
            <>
              <CardContent>
                <div>
                  <div>
                    <div className="mb-8">
                      <div className="flex items-center justify-between">
                        <span>Addon Expiry:</span>
                        <span>{addonExpiry.toLocaleString("en-IN", dateFormat)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Reading Fee:</span>
                        <span>{addonFees}</span>
                      </div>
                    </div>
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
                    {addonFees -
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
          Add-on
        </Button>
      </form>
      {errorMessage && (
        <div className="flex text-red-500 mt-4">
          <AlertCircle className="mr-1 w-5" />
          <p className="font-semibold">{errorMessage}</p>
        </div>
      )}
    </Form>
  ) : (
    <div>{"Patron\'s subscription has expired."}</div>
  );
}
