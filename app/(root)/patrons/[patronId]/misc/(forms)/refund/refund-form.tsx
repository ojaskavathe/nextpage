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

import { patronMiscRefundSchema } from "@/lib/schema";
import { PatronWithSub, sr_id } from "@/lib/utils";

import { AlertCircle } from "lucide-react";
import { miscRefund } from "@/server/patron";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MiscRefundForm({ patron }: { patron: PatronWithSub }) {

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof patronMiscRefundSchema>>({
    resolver: zodResolver(patronMiscRefundSchema),
    defaultValues: {
      id: patron.id,
      adjust: '',
      reason: '',
      offer: '',
      remarks: '',
    }
  })

  const adjustWatch = form.watch('adjust', '');

  const total =
    // @ts-ignore
    Number(adjustWatch == "" || adjustWatch == "-" ? 0 : adjustWatch) -
    patron.deposit;

  const onSubmit = async (data: z.infer<typeof patronMiscRefundSchema>) => {
    const res = await miscRefund(data);

    if (res.error == 0) {
      router.push(`/patrons/${patron.id}`);
      toast.success(`Patron ${sr_id(data.id)} deposit refunded!`);
    } else {
      setErrorMessage(res.message)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
            {(!patron.deposit) &&
              <CardDescription>No Deposit on Patron!</CardDescription>}
          </CardHeader>
          {!!patron.deposit &&
            <>
              <CardContent>
                <div>
                  <div className="flex items-center justify-between">
                    <span>Deposit Refund:</span>
                    <span>- ₹{patron.deposit}</span>
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
                  <span>{total < 0 ? `- ₹${-total}` : `₹${total}`}</span>
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
