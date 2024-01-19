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
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { patronMiscDDSchema } from "@/lib/schema";
import {
  DDFees,
  PatronWithSub
} from "@/lib/utils";

import { AlertCircle } from "lucide-react";

export default function MiscDDForm({ patron }: { patron: PatronWithSub }) {

  const [numDD, setNumDD] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date();
  const planExpiry = patron.subscription!.expiryDate;

  let numDays = 0;
  const isPlanValid = planExpiry > today;
  if (isPlanValid) {
    numDays = Math.floor(
      (planExpiry.valueOf() - today.valueOf())
      / (1000 * 60 * 60 * 24)
    );
  }

  const form = useForm<z.infer<typeof patronMiscDDSchema>>({
    resolver: zodResolver(patronMiscDDSchema),
    defaultValues: {
      id: patron.id,
      numDD: '',
      adjust: '',
      reason: '',
      offer: '',
      remarks: '',
    }
  })

  const adjustWatch = form.watch('adjust', '');

  const onSubmit = async (data: z.infer<typeof patronMiscDDSchema>) => {
    console.log(data)

    // if (res.error == 0) {
    //   router.push(`/patrons/${patron.id}`);
    //   toast.success(`Patron ${sr_id(data.id)} renewed successfully!`);
    // } else {
    //   setErrorMessage(res.message)
    // }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="numDD"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem className="w-full">
              <FormLabel>Paid DD</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => {
                    // only allow integers
                    if (e.target.value === '' || /^\d*$/.test(e.target.value)) {
                      setNumDD(parseInt(e.target.value))
                      onChange(e.target.value)
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
        <TransactionDetails
          form={form}
        />
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
            {(!numDD) &&
              <CardDescription>Number of DD must be more than 0!</CardDescription>}
          </CardHeader>
          {!!numDD &&
            <>
              <CardContent>
                <div>
                  <div>
                    <div className="mb-8">
                      <div className="flex items-center justify-between">
                        <span>Added DD:</span>
                        <span>{numDD}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Total paid DD on patron (after payment):</span>
                        <span>{(patron.subscription?.paidDD || 0) + numDD}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>DD Fees:</span>
                      <span>₹{numDD * DDFees}</span>
                    </div>
                  </div>

                  {!!adjustWatch && adjustWatch.toString() !== '-' &&
                    <div className="flex items-center justify-between">
                      <span>Adjustment:</span>
                      <span>{adjustWatch < 0 ? `- ₹${-adjustWatch}` : `₹${adjustWatch}`}</span>
                    </div>}
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full font-bold flex items-center justify-between">
                  <span>Total:</span>
                  <span>₹{
                    (numDD ? (numDD * DDFees) : 0) -
                    (adjustWatch!.toString() !== '-' ? -adjustWatch! : 0)
                  }</span>
                </div>
              </CardFooter>
            </>}
        </Card>
        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={form.formState.isSubmitting}
        >
          Add DD
        </Button>
      </form>
      {errorMessage &&
        <div className="flex text-red-500 mt-4">
          <AlertCircle className="mr-1 w-5" />
          <p className="font-semibold">
            {errorMessage}
          </p>
        </div>}
    </Form>
  )
}