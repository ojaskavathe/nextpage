"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { TransactionMode } from "@/components/transaction-details";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { expenseSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { AlertCircle, CalendarIcon, CircleMinus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { $Enums, ExpenseCategory } from "@prisma/client";
import { addCategory, createExpense, removeCategory } from "@/server/expenses";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export default function ExpenseForm({
  categories,
  role,
  className,
}: {
  categories: ExpenseCategory[];
  role: $Enums.Role;
  className: string;
}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date();

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: "",
      amount: "",
      remarks: "",
      createdAt: today,
    },
  });

  const [isPending, startTransition] = useTransition();
  async function handleAdd() {
    if (!newCat) return;
    await addCategory(newCat);

    startTransition(() => {
      router.refresh();
    });
  }

  async function handleRemove(id: string) {
    await removeCategory(id);
    startTransition(() => {
      router.refresh();
    });
  }

  const onSubmit = async (data: z.infer<typeof expenseSchema>) => {
    const res = await createExpense(data);

    if (res.error == 0) {
      router.refresh();
      toast.success(`Expense Added!`);
    } else {
      setErrorMessage(res.message);
    }
  };

  const [newCat, setNewCat] = useState("");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <TransactionMode form={form} />
        <div className="mt-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full basis-1/2">
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value: string) => {
                    field.onChange(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((i) => (
                      <div
                        className="flex items-center justify-between"
                        key={i.name}
                      >
                        <SelectItem value={`${i.name}`} key={i.name}>
                          {i.name}
                        </SelectItem>
                        {role == $Enums.Role.ADMIN && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="p-0 h-4 w-4 mx-4 rounded-full"
                            onClick={() => handleRemove(i.name)}
                          >
                            <CircleMinus className="h-full" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {role == $Enums.Role.ADMIN && (
                      <div className="mt-2 p-1 flex space-x-2 items-center justify-between max-w-[--radix-select-trigger-width]">
                        <Input
                          className="h-8 w-full"
                          onChange={(e) => {
                            setNewCat(e.target.value);
                          }}
                          disabled={isPending}
                        />
                        <Button
                          size="sm"
                          className="h-8"
                          onClick={handleAdd}
                          disabled={isPending}
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field: { onChange, ...fieldProps } }) => (
              <FormItem className="w-full basis-1/2">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => {
                      // only allow integers
                      if (
                        e.target.value === "" ||
                        /^-?\d*$/.test(e.target.value)
                      ) {
                        onChange(e.target.value);
                      }
                    }}
                    {...fieldProps}
                    placeholder="200"
                    inputMode="numeric"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem className="w-full basis-1/2">
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Special Comment" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="createdAt"
            render={({ field }) => (
              <FormItem className="w-full basis-1/2">
                <FormLabel>Scheduled for:</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          field.value.toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={form.formState.isSubmitting}
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
