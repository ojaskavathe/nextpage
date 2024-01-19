import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";

import {
  Banknote,
  CreditCard,
  IndianRupee,
  QrCode
} from "lucide-react";

export default function TransactionDetails({ form }: any) {

  return (
    <>
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