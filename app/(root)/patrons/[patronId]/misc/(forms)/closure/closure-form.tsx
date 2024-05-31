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

import { patronMiscClosureSchema } from "@/lib/schema";
import { PatronWithSub, sr_id } from "@/lib/utils";

import { AlertCircle, BookKey } from "lucide-react";
import { miscClosure } from "@/server/patron";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

export default function MiscClosureForm({ patron }: { patron: PatronWithSub }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const [depositRefund, setDepositRefund] = useState(true);

  const form = useForm<z.infer<typeof patronMiscClosureSchema>>({
    resolver: zodResolver(patronMiscClosureSchema),
    defaultValues: {
      id: patron.id,
      depositRefund: depositRefund,
      adjust: "",
      reason: "",
      offer: "",
      remarks: "",
    },
  });

  const adjustWatch = form.watch("adjust", "");

  // the ts-ignore is for cases when the input is just "-",
  // as adjustWatch can technically only by either a number or an empty string
  const total =
    // @ts-ignore
    Number(adjustWatch == "" || adjustWatch == "-" ? 0 : adjustWatch) +
    Number(depositRefund ? -patron.deposit : 0);

  const onSubmit = async (data: z.infer<typeof patronMiscClosureSchema>) => {
    const res = await miscClosure(data);

    if (res.error == 0) {
      router.push(`/patrons/${patron.id}`);
      toast.success(`Patron ${sr_id(data.id)} account closed succesfully!`);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="basis-1/2 space-y-2">
            <Label>Deposit:</Label>
            <div className="flex space-x-2">
              <div className="py-2 px-3 border rounded-md text-sm bg-secondary flex-grow">
                ₹{patron.deposit}
              </div>
              <FormField
                control={form.control}
                name="depositRefund"
                render={({ field }) => (
                  <FormItem className="sm:basis-1/3 flex flex-col items-center justify-center">
                    <FormControl>
                      <Toggle
                        variant="outline"
                        aria-label="Toggle deposit"
                        defaultPressed={field.value}
                        onPressedChange={(e) => {
                          field.onChange(e.valueOf());
                          setDepositRefund(e.valueOf());
                        }}
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        {field.value ? (
                          <BookKey className="w-4" />
                        ) : (
                          <BookKey className="w-4" />
                        )}
                        <span className="hidden md:inline">Deposit</span>
                      </Toggle>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="basis-1/2 space-y-2">
            <Label>Expires on:</Label>
            <div className="py-2 px-3 border rounded-md text-sm bg-secondary">
              {patron.subscription?.expiryDate.toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
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
            {patron.subscription?.closed && (
              <CardDescription>Patron already closed!</CardDescription>
            )}
          </CardHeader>

          {!patron.subscription?.closed && (
            <div>
              <CardContent>
                <div>
                  {depositRefund && (
                    <div className="flex items-center justify-between">
                      <span>Deposit Refund:</span>
                      <span>- ₹{patron.deposit}</span>
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
                  <span>{total < 0 ? `- ₹${-total}` : `₹${total}`}</span>
                </div>
              </CardFooter>
            </div>
          )}
        </Card>
        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={form.formState.isSubmitting || !patron.deposit}
        >
          Submit
        </Button>
      </form>
      {errorMessage && (
        <div className="flex text-red-500 mt-4">
          <AlertCircle className="mr-1 w-5" />
          <p className="font-semibold">{errorMessage}</p>
        </div>
      )}
    </Form>
  );
}
