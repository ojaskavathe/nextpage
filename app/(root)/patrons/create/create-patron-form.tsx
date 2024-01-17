"use client";

import Image from "next/image";
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
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";

import { patronCreateSchema } from "@/lib/schema";
import {
  DDFees,
  discounts,
  durations,
  fee,
  freeDDs,
  holidays,
  refundableDeposit,
  registrationFees
} from "@/lib/utils";
import { createPatron } from "@/server/patron";

import { AlertCircle } from "lucide-react";

export default function PatronCreateForm() {

  const [plan, setPlan] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paidDD, setPaidDD] = useState(0);

  const { push } = useRouter();

  const readingFee = fee[plan - 1] * duration;

  const index = durations.indexOf(duration);
  const freeDD = freeDDs[index];
  const freeHoliday = holidays[index];
  const discount = readingFee * discounts[index];

  const form = useForm<z.infer<typeof patronCreateSchema>>({
    resolver: zodResolver(patronCreateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      altPhone: '',
      address: '',
      pincode: '',
      whatsapp: true,
      remarks: '',
      offer: '',
      adjust: '',
      paidDD: '',
      reason: ''
    }
  });
  const adjustWatch = form.watch('adjust', 0);

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (patronData: z.infer<typeof patronCreateSchema>) => {
    const res = await createPatron(patronData);

    if (res.error)
      setErrorMessage(res.message);
    else {
      toast("Sign-up Successful", {
        description: `M${res.data!.id} created.`
      })
      push(`/patrons/${res.data!.id}`);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="xl:w-2/3"
      >
        <PatronFormDetails
          form={form}
          setPlan={setPlan}
          setDuration={setDuration}
          setPaidDD={setPaidDD}
        />

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
                    <span>Security Deposit:</span>
                    <span>₹{refundableDeposit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Registration Fees:</span>
                    <span>₹{registrationFees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reading Fees:</span>
                    <span>₹{fee[plan - 1] * duration}</span>
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
                  {adjustWatch != 0 && adjustWatch.toString() !== '-' &&
                    <div className="flex items-center justify-between">
                      <span>Adjustment:</span>
                      <span>{(adjustWatch || 0) < 0 ? `- ₹${-adjustWatch}` : `₹${adjustWatch}`}</span>
                    </div>}
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full font-bold flex items-center justify-between">
                  <span>Total:</span>
                  <span>₹{
                    readingFee +
                    registrationFees +
                    refundableDeposit -
                    discount -
                    (adjustWatch!.toString() !== '-' ? -adjustWatch! : 0) -
                    (paidDD ? -(paidDD * DDFees) : 0)
                  }</span>
                </div>
              </CardFooter>
            </>}
        </Card>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="mt-0"
                  placeholder="John Doe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="john.doe@mail.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field: { onChange, ...fieldProps } }) => (
              <FormItem className="mt-4 flex-grow">
                <FormLabel>Phone</FormLabel>
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
                    placeholder="9879879876"
                    inputMode="numeric"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem className="mt-12 flex flex-col items-center justify-center">
                <FormControl>
                  <Toggle
                    variant="outline"
                    aria-label="Toggle whatsapp"
                    defaultPressed={field.value}
                    onPressedChange={field.onChange}
                    className="flex items-center justify-center"
                  >
                    <Image src="/whatsapp.svg" height={20} width={20} alt="Whatsapp" className="mr-0 md:mr-2" />
                    <span className="hidden md:inline">Whatsapp</span>
                  </Toggle>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="altPhone"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem className="mt-4">
              <FormLabel>Alternate Phone</FormLabel>
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
                  placeholder="1231231234"
                  inputMode="numeric"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="Flat 302, Sangria Apts., Near Tilted Towers, Flyover Lane, Magarpatta, Pune"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pincode"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Pincode</FormLabel>
              <FormControl>
                <Input {...field} placeholder="411048" inputMode="numeric" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
        <Button type="submit" className="mt-6 w-full" disabled={form.formState.isSubmitting}>Sign-up</Button>
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
