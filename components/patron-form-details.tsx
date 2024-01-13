"use client";

import {
  Dispatch,
  SetStateAction
} from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import {
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
import { Input } from "@/components/ui/input"
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Banknote,
  CreditCard,
  IndianRupee,
  QrCode
} from "lucide-react";

interface FormDetailProps {
  form: any;
  setPlan: Dispatch<SetStateAction<number>>;
  setDuration: Dispatch<SetStateAction<number>>;
  setPaidDD: Dispatch<SetStateAction<number>>;
}

export default function PatronFormDetails({ form, setPlan, setDuration, setPaidDD }: FormDetailProps) {

  return (
    <>
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
                    if (e.target.value === '' || /^\d*$/.test(e.target.value)) {
                      setPaidDD(parseInt(e.target.value))
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
    </>
  )
}