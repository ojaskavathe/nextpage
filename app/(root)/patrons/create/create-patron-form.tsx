"use client";

import { trpc } from "@/app/_trpc/client";

import { zodResolver } from "@hookform/resolvers/zod"
import { FieldError, useForm } from "react-hook-form";
import * as z from "zod"
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { patronSchema } from "@/lib/schema";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Banknote, CreditCard, IndianRupee, QrCode } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";

const months = [1, 3, 6, 12];
const dd = [0, 0, 2, 4];
const hol = [0, 0, 1, 2];
const dis = [0, 0.05, 0.1, 0.2];

const fee = [300, 400, 500, 600, 700, 800];
const registrationFees = 199;
const refundableDeposit = 499;

export default function PatronCreateForm() {

  const createPatronMutation = trpc.createPatron.useMutation();

  const { pending } = useFormStatus();

  const [plan, setPlan] = useState(0);
  const [duration, setDuration] = useState(0);
  const today = new Date();

  const exp = new Date(today.setMonth(today.getMonth() + duration));

  const readingFee = fee[plan - 1] * duration;

  const index = months.indexOf(duration);
  const freeDD = dd[index];
  const freeHoliday = hol[index];
  const discount = readingFee * dis[index];

  const form = useForm<z.infer<typeof patronSchema>>({
    resolver: zodResolver(patronSchema),
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
      adjust: 0,
      reason: ''
    }
  });
  const adjustWatch = form.watch('adjust', 0);

  const onSubmit = (data: z.infer<typeof patronSchema>) => {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex items-center space-x-4">
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
                    <SelectTrigger >
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <SelectItem value={`${i}`} key={i}>{i} Book</SelectItem>
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
                    field.onChange(parseInt(value))
                  }}
                >
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue placeholder="Select a duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 3, 6, 12].map(i => (
                      <SelectItem value={`${i}`} key={i}>{i} Months</SelectItem>
                    ))}

                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Payment Mode</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  className="grid grid-cols-4 gap-4"
                >
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="CASH"
                        id="cash"
                        className="peer sr-only" />
                    </FormControl>
                    <Label
                      htmlFor="cash"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Banknote className="mb-3 h-6 w-6" />
                      Cash
                    </Label>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="CARD"
                        id="card"
                        className="peer sr-only" />
                    </FormControl>
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <CreditCard className="mb-3 h-6 w-6" />
                      Card
                    </Label>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="UPI"
                        id="upi"
                        className="peer sr-only" />
                    </FormControl>
                    <Label
                      htmlFor="upi"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <QrCode className="mb-3 h-6 w-6" />
                      UPI
                    </Label>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="OTHER"
                        id="other"
                        className="peer sr-only" />
                    </FormControl>
                    <Label
                      htmlFor="other"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <IndianRupee className="mb-3 h-6 w-6" />
                      Other
                    </Label>
                  </FormItem>

                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="adjust"
            render={({ field: { onChange, ...fieldProps } }) => (
              <FormItem className="mt-4 flex-grow">
                <FormLabel>Adjust</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => {
                      // only allow integers
                      if (e.target.value === '' || /^-?\d*$/.test(e.target.value)) {
                        onChange(e.target.value)
                      }
                    }}
                    {...fieldProps}
                    className="mt-0"
                    placeholder="-200"
                    inputMode="numeric"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="mt-4 flex-grow">
                <FormLabel>Reason</FormLabel>
                <FormControl>
                  <Input
                    className="mt-0"
                    placeholder="Previous Member"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <div className="flex items-center justify-between">
                    <span>Discount:</span>
                    <span>- ₹{readingFee * dis[index]}</span>
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
                    readingFee +
                    registrationFees +
                    refundableDeposit -
                    discount -
                    (adjustWatch!.toString() !== '-' ? -adjustWatch! : 0)
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
          name="offer"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Offer</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Special Offers" />
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
        <Button type="submit" className="mt-6 w-full" >Sign-up</Button>
      </form>
    </Form>
  )
}
