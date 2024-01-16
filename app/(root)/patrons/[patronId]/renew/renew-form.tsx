"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import PatronFormDetails from "@/components/patron-form-details";
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
import { Label } from "@/components/ui/label";
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
  sr_id
} from "@/lib/utils";
import { renewPatron } from "@/server/patron";

import {
  AlertCircle,
  CalendarMinus,
  CalendarPlus
} from "lucide-react";

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
  const isPatronLate = (patron.subscription!.booksInHand > 0) && (oldExpiry < today);
  if (isPatronLate) {
    numDays = Math.floor(
      (today.valueOf() - oldExpiry.valueOf())
      / (1000 * 60 * 60 * 24)
    );
  }

  const lateFees = fromExpiry
    ? 0
    : plan
      ? Math.floor(fee[plan - 1] * numDays / 30)
      : 0;
  const newExpiry = isPatronLate
    ? fromExpiry
      ? new Date(new Date(oldExpiry).setMonth(oldExpiry.getMonth() + duration))
      : new Date(today.setMonth(today.getMonth() + duration))
    : new Date(new Date(oldExpiry).setMonth(oldExpiry.getMonth() + duration))

  const readingFee = fee[plan - 1] * duration;

  const index = durations.indexOf(duration);
  const freeDD = freeDDs[index];
  const freeHoliday = holidays[index];
  const discount = readingFee * discounts[index];

  const form = useForm<z.infer<typeof patronRenewSchema>>({
    resolver: zodResolver(patronRenewSchema),
    defaultValues: {
      id: patron.id,
      paidDD: '',
      adjust: '',
      reason: '',
      offer: '',
      remarks: '',
      renewFromExpiry: false,
    }
  })

  const adjustWatch = form.watch('adjust', '');

  const onSubmit = async (data: z.infer<typeof patronRenewSchema>) => {
    console.log(data)

    const res = await renewPatron(data);

    if (res.error == 0) {
      router.push(`/patrons/${patron.id}`);
      router.refresh();
      toast.success(`Patron ${sr_id(data.id)} renewed successfully!`);
    } else {
      setErrorMessage(res.message)
    }
  }

  return (
    <Card className="mt-8 xl:w-2/3">
      <CardHeader>
        <CardTitle>Renew</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <PatronFormDetails
              form={form}
              setPlan={setPlan}
              setDuration={setDuration}
              setPaidDD={setPaidDD}
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
            <div className="flex items-center space-x-4">
              <div className="mt-4 flex-grow">
                <Label>Past Dues:</Label>
                <div className="mt-2 py-2 px-3 border rounded-md text-sm bg-secondary">
                  {lateFees}
                </div>
              </div>
              {!!plan && <FormField
                control={form.control}
                name="renewFromExpiry"
                render={({ field }) => (
                  <FormItem className="mt-12 flex flex-col items-center justify-center">
                    <FormControl>
                      <Toggle
                        variant="outline"
                        aria-label="Toggle whatsapp"
                        defaultPressed={field.value}
                        onPressedChange={(e) => {
                          field.onChange(e.valueOf());
                          setFromExpiry(e.valueOf());
                        }}
                        className="flex items-center justify-center space-x-2"
                        disabled={!isPatronLate}
                      >
                        {field.value ? <CalendarPlus className="w-4" /> : <CalendarMinus className="w-4" />}
                        <span className="hidden md:inline">Renew From {field.value ? "Today" : "Expiry"}</span>
                      </Toggle>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />}
            </div>
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                {(!plan || !duration) &&
                  <CardDescription>Enter Plan and Duration first!</CardDescription>}
              </CardHeader>
              {!!plan && !!duration &&
                <>
                  <CardContent>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span>New Expiry:</span>
                        <span>{newExpiry.toLocaleDateString("en-IN", {
                          day: 'numeric',
                          month: "long",
                          year: 'numeric',
                        })}</span>
                      </div>
                      {!!freeDD &&
                        <div className="mb-8">
                          <div className="flex items-center justify-between">
                            <span>Free DD:</span>
                            <span>{freeDD}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Free Subsciption Holidays:</span>
                            <span>{freeHoliday}</span>
                          </div>
                        </div>}
                      <div className="flex items-center justify-between">
                        <span>Reading Fees:</span>
                        <span>₹{readingFee}</span>
                      </div>
                      {!!paidDD &&
                        <div className="flex items-center justify-between">
                          <span>DD Fees:</span>
                          <span>₹{paidDD * DDFees}</span>
                        </div>}
                      <div className="flex items-center justify-between">
                        <span>Discount:</span>
                        <span>- ₹{readingFee * discounts[index]}</span>
                      </div>
                      {!!lateFees &&
                        <div className="flex items-center justify-between">
                          <span>Past Dues:</span>
                          <span>{`₹${lateFees}`}</span>
                        </div>}
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
                        readingFee -
                        discount +
                        lateFees +
                        (paidDD ? (paidDD * DDFees) : 0) -
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
              Renew
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
      </CardContent>
    </Card>
  )
}