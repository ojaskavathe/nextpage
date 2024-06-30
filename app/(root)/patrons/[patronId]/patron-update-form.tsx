"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";

import { FootfallDialog } from "@/components/footfall-form";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";

import { patronUpdateSchema } from "@/lib/schema";
import { cn, PatronFull, sr_id } from "@/lib/utils";
import { updatePatron } from "@/server/patron";

import { AlertCircle, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function PatronUpdateForm({
  patron,
  className,
}: {
  patron: PatronFull;
  className?: string;
}) {
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof patronUpdateSchema>>({
    resolver: zodResolver(patronUpdateSchema),
    defaultValues: {
      id: patron.id,
      expiry: patron.subscription!.expiryDate,
      name: patron.name,
      email: patron.email,
      phone: patron.phone,
      altPhone: patron.altPhone || "",
      address: patron.address || "",
      pincode: patron.pincode || "",
      whatsapp: patron.whatsapp,
      remarks: patron.remarks || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof patronUpdateSchema>) => {
    const lenDirtyFields = Object.keys(form.formState.dirtyFields).length;
    if (lenDirtyFields == 0) {
      toast.warning("Edit some values first!");
    } else {
      const res = await updatePatron(data);

      if (res.error == 0) {
        toast.success(`Patron ${sr_id(data.id)} updated successfully!`);
        form.reset(data);
      } else {
        setErrorMessage(res.message);
      }
    }
  };

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Patron Details - {sr_id(patron.id)}</CardTitle>
              <CardDescription>View and Edit Patron Details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="basis-1/2">
                  <Label>Plan:</Label>
                  <div className="py-2 px-3 border rounded-md text-sm bg-secondary">
                    {patron.subscription?.plan} Book
                  </div>
                </div>
                <div className="basis-1/2">
                  <FormField
                    control={form.control}
                    name="expiry"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel>Expiry:</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="h-auto w-full py-2 px-3 text-sm"
                              >
                                {field.value.toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                                <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              defaultMonth={field.value}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-2">
                <div className="mt-4 basis-1/2">
                  <Label>Free DD:</Label>
                  <div className="mt-2 py-2 px-3 border rounded-md text-sm bg-secondary">
                    {patron.subscription?.freeDD}
                  </div>
                </div>
                <div className="mt-4 basis-1/2">
                  <Label>Free Holidays:</Label>
                  <div className="mt-2 py-2 px-3 border rounded-md text-sm bg-secondary">
                    {patron.subscription?.freeHoliday}
                  </div>
                </div>
              </div>
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
                            if (
                              e.target.value === "" ||
                              /^\d*$/.test(e.target.value)
                            ) {
                              onChange(e.target.value);
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
                          <Image
                            src="/whatsapp.svg"
                            height={20}
                            width={20}
                            alt="Whatsapp"
                            className="mr-0 md:mr-2"
                          />
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
                          if (
                            e.target.value === "" ||
                            /^\d*$/.test(e.target.value)
                          ) {
                            onChange(e.target.value);
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
                      <Input
                        {...field}
                        placeholder="411048"
                        inputMode="numeric"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4">
                <Label>Joining Date:</Label>
                <div className="mt-2 py-2 px-3 border rounded-md text-sm bg-secondary">
                  {patron.joiningDate.toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
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
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={form.formState.isSubmitting}
              >
                Save
              </Button>
            </CardFooter>
          </Card>
        </form>
        {errorMessage && (
          <div className="flex text-red-500 mt-4">
            <AlertCircle className="mr-1 w-5" />
            <p className="font-semibold">{errorMessage}</p>
          </div>
        )}
      </Form>
    </div>
  );
}
