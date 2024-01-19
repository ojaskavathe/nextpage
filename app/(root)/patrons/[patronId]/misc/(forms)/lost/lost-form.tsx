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

import { patronMiscLostSchema } from "@/lib/schema";
import { PatronWithSub } from "@/lib/utils";

import { AlertCircle } from "lucide-react";

export default function MiscLostForm({ patron }: { patron: PatronWithSub }) {

  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof patronMiscLostSchema>>({
    resolver: zodResolver(patronMiscLostSchema),
    defaultValues: {
      id: patron.id,
      amount: '',
      adjust: '',
      reason: '',
      offer: '',
      remarks: '',
    }
  })

  const adjustWatch = form.watch('adjust', '');
  const amountWatch = form.watch('amount', '');

  const onSubmit = async (data: z.infer<typeof patronMiscLostSchema>) => {
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
          name="amount"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem className="w-full">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => {
                    // only allow integers
                    if (e.target.value === '' || /^\d*$/.test(e.target.value)) {
                      onChange(e.target.value)
                    }
                  }}
                  {...fieldProps}
                  className="mt-0"
                  placeholder="400"
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
            {(!amountWatch) &&
              <CardDescription>Enter amount for lost book/magazine!</CardDescription>}
          </CardHeader>
          {!!amountWatch &&
            <>
              <CardContent>
                <div>
                  <div className="flex items-center justify-between">
                    <span>Amount:</span>
                    <span>₹{amountWatch}</span>
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
                    amountWatch -
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
          Submit
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