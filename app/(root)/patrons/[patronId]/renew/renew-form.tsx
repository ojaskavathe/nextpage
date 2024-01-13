"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, Banknote, CreditCard, IndianRupee, QrCode } from "lucide-react";

import { patronRenewSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { PatronFull } from "@/lib/utils";
import PatronFormDetails from "@/components/patron-form-details";

const months = [1, 3, 6, 12];
const dd = [0, 0, 2, 4];
const hol = [0, 0, 1, 2];
const dis = [0, 0.05, 0.1, 0.2];

const fee = [300, 400, 500, 600, 700, 800];
const DDFees = 25;

export default function RenewForm({ patronId }: { patronId: number }) {

  const [plan, setPlan] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paidDD, setPaidDD] = useState(0);

  const readingFee = fee[plan - 1] * duration;

  const index = months.indexOf(duration);
  const freeDD = dd[index];
  const freeHoliday = hol[index];
  const discount = readingFee * dis[index];

  const form = useForm<z.infer<typeof patronRenewSchema>>({
    resolver: zodResolver(patronRenewSchema),
    defaultValues: {
      id: patronId,
      paidDD: '',
      adjust: '',
      reason: '',
      offer: '',
      pastDues: ''
    }
  })

  const adjustWatch = form.watch('adjust', 0);
  const pastDuesWatch = form.watch('pastDues', 0);

  const onSubmit = async (data: z.infer<typeof patronRenewSchema>) => {
    console.log(data)
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
              name="pastDues"
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem className="mt-4 flex-grow">
                  <FormLabel>Past Dues</FormLabel>
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
                      placeholder="300"
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                        <span>- ₹{readingFee * dis[index]}</span>
                      </div>
                      {!!pastDuesWatch && pastDuesWatch.toString() !== '-' &&
                        <div className="flex items-center justify-between">
                          <span>Past Dues:</span>
                          <span>{`₹${pastDuesWatch}`}</span>
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
                        discount -
                        (pastDuesWatch!.toString() !== '-' ? -pastDuesWatch! : 0) -
                        (paidDD ? -(paidDD * DDFees) : 0) -
                        (adjustWatch!.toString() !== '-' ? -adjustWatch! : 0)
                      }</span>
                    </div>
                  </CardFooter>
                </>}
            </Card>
            <Button
              type="submit"
              className="mt-6 w-full"
            >
              Renew
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}