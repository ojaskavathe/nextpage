"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { $Enums, Prisma } from "@prisma/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { AlertCircle, ArrowDownUp, Banknote, Bike, CalendarIcon, CreditCard, Download, IndianRupee, QrCode, Truck, Upload } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { footfallFormSchema } from "@/lib/schema";
import { createFootfall } from "@/server/patron";

type PatronWithSub = Prisma.PatronGetPayload<{ include: { subscription: true } }>;

export function FootfallDialog({ className, patron }: { className?: string, patron: PatronWithSub }) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className={className} variant="outline">Footfall</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Footfall</DialogTitle>
            <DialogDescription>
              Record patron issue/return
            </DialogDescription>
          </DialogHeader>
          <FootfallForm patron={patron} setOpen={setOpen} />
          <DialogFooter className="pt-2">
            <Button type="submit" form="ff" className="w-full">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} >
      <DrawerTrigger asChild>
        <Button variant="outline">Footfall</Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[95%]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Footfall</DrawerTitle>
          <DrawerDescription>
            Record patron issue/return
          </DrawerDescription>
        </DrawerHeader>
        <FootfallForm className="px-4 overflow-auto" patron={patron} setOpen={setOpen} />
        <DrawerFooter className="pt-4">
          <Button type="submit" form="ff">Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function FootfallForm({ className, patron, setOpen }: {
  className?: string,
  patron: PatronWithSub,
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [errorMessage, setErrorMessage] = useState('');

  const DDType = patron.subscription!.freeDD > 0
    ? $Enums.DDType.FREE
    : $Enums.DDType.PAID;

  const DDwarning = patron.subscription!.freeDD <= 0 && patron.subscription!.paidDD <= 0;

  const form = useForm<z.infer<typeof footfallFormSchema>>({
    resolver: zodResolver(footfallFormSchema),
    defaultValues: {
      id: patron.id,
      offer: '',
      remarks: '',
      isDD: false,
      DDType: DDType,
      numBooks: 1,
      scheduledDate: new Date(),
      message: ''
    }
  })
  const isDD = form.watch("isDD");

  const onSubmit = async (data: z.infer<typeof footfallFormSchema>) => {
    // const res = await createFootfall(data);

    // if (res.error)
    //   setErrorMessage(res.message);
    // else {
    //   setOpen(false)
    //   toast.success("Footfall recorded", {
    //     description: `M${res.data!.patronId}: ${res.data!.type}`
    //   })
    // }
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        id="ff"
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid items-start gap-4", className)}>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  className="flex space-x-2"
                >
                  <FormItem className="basis-1/3">
                    <FormControl>
                      <RadioGroupItem
                        value={$Enums.FootfallType.ISSUE}
                        id={$Enums.FootfallType.ISSUE}
                        className="peer sr-only"
                      />
                    </FormControl>
                    <Label
                      htmlFor={$Enums.FootfallType.ISSUE}
                      className="flex items-center justify-center space-x-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Upload className='w-4' />
                      <span>Issue</span>
                    </Label>
                  </FormItem>
                  <FormItem className="basis-1/3">
                    <FormControl>
                      <RadioGroupItem
                        value={$Enums.FootfallType.RETURN}
                        id={$Enums.FootfallType.RETURN}
                        className="peer sr-only"
                      />
                    </FormControl>
                    <Label
                      htmlFor={$Enums.FootfallType.RETURN}
                      className="flex items-center justify-center space-x-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Download className='w-4' />
                      <span>Return</span>
                    </Label>
                  </FormItem>
                  <FormItem className="basis-1/3">
                    <FormControl>
                      <RadioGroupItem
                        value={$Enums.FootfallType.BOTH}
                        id={$Enums.FootfallType.BOTH}
                        className="peer sr-only"
                      />
                    </FormControl>
                    <Label
                      htmlFor={$Enums.FootfallType.BOTH}
                      className="flex items-center justify-center space-x-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <ArrowDownUp className='w-4' />
                      <span>Both</span>
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
            name="offer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offer</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Special Offer" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Comments" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-lg border border-slate-300 p-3 shadow-sm">
          <FormField
            control={form.control}
            name="isDD"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-y-0">
                <FormLabel>Is it a delivery?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {isDD && <FootfallDelivery isDD={isDD} form={form} DDwarning={DDwarning} patron={patron} />} */}
          <FootfallDelivery isDD={isDD} form={form} DDwarning={DDwarning} patron={patron} />
        </div>

        {/* <Button type="submit">Submit</Button> */}
      </form>
      {errorMessage &&
        <div className="flex text-red-500">
          <AlertCircle className="mr-1 w-5" />
          <p className="font-semibold">
            {errorMessage}
          </p>
        </div>}
    </Form>

  )
}

function FootfallDelivery({ isDD, form, DDwarning, patron }: {
  isDD: boolean
  form: UseFormReturn<z.infer<typeof footfallFormSchema>>,
  DDwarning: boolean,
  patron: PatronWithSub
}) {
  return (
    <div
      className={`${isDD ? 'max-h-72 mt-2' : 'max-h-0 mt-0'} overflow-hidden space-y-2 transition-[max-height margin] duration-500 ease-in-out`}
    >
      <FormField
        control={form.control}
        name="DDType"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                defaultValue={field.value}
                onValueChange={field.onChange}
                className="flex space-x-2 items-center"
              >
                <FormItem className="flex-grow">
                  <FormControl>
                    <RadioGroupItem
                      value={$Enums.DDType.FREE}
                      id={$Enums.DDType.FREE}
                      className="peer sr-only"
                      disabled={DDwarning}
                    />
                  </FormControl>
                  <Label
                    htmlFor={$Enums.DDType.FREE}
                    className="flex items-center justify-center space-x-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Bike className='w-4' />
                    <span>Free: {patron.subscription!.freeDD}</span>
                  </Label>
                </FormItem>
                <FormItem className="flex-grow">
                  <FormControl>
                    <RadioGroupItem
                      value={$Enums.DDType.PAID}
                      id={$Enums.DDType.PAID}
                      className="peer sr-only" />
                  </FormControl>
                  <Label
                    htmlFor={$Enums.DDType.PAID}
                    className="flex items-center justify-center space-x-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Bike className='w-4' />
                    <span>Paid: {patron.subscription!.paidDD}</span>
                  </Label>
                </FormItem>
                {DDwarning && <Label
                  htmlFor={$Enums.DDType.FREE}
                  className="text-red-500 flex items-center justify-center space-x-2 rounded-md border-2 border-red-500 bg-popover p-2 mt-2"
                >
                  <AlertCircle className='w-4' />
                </Label>}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex space-x-4">
        <FormField
          control={form.control}
          name="scheduledDate"
          render={({ field }) => (
            <FormItem className="basis-2/3">
              <FormLabel>Scheduled for:</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {
                        field.value ? field.value.toLocaleDateString("en-IN", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }) : <span>Pick a date</span>
                      }
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      // to allow selecting today
                      let yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1)
                      return (date <= yesterday)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numBooks"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem className="basis-1/3">
              <FormLabel>Books:</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => {
                    // only allow integers
                    if (e.target.value === '') {
                      onChange(e.target.value);
                    } else if (/^\d*$/.test(e.target.value)) {
                      onChange(parseInt(e.target.value));
                    }
                  }}
                  {...fieldProps}
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
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Message:</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Get Rs 200 extra" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}