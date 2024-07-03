"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

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
import { Label } from "@/components/ui/label";

import { supportUpdateSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

import { AlertCircle, Download, Upload } from "lucide-react";
import { $Enums, Support } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateSupport } from "@/server/staff";
import { useRouter } from "next/navigation";

export default function SupportForm({
  support,
  className,
}: {
  support: Support;
  className?: string;
}) {
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof supportUpdateSchema>>({
    resolver: zodResolver(supportUpdateSchema),
    defaultValues: {
      id: support.id,
      username: support.username,
      password: support.password,
      role: support.role,
    },
  });

  const { push, refresh } = useRouter(); 

  const onSubmit = async (data: z.infer<typeof supportUpdateSchema>) => {
    const lenDirtyFields = Object.keys(form.formState.dirtyFields).length;
    if (lenDirtyFields == 0) {
      toast.warning("Edit some values first!");
    } else {
      const res = await updateSupport(data);

      if (res.error == 0) {
        toast.success(`Support ${data.username} updated successfully!`);
        form.reset(data);
        push(`/admin/staff`)
        refresh();
      } else {
        setErrorMessage(res.message);
      }
    }
  };

  return (
    <div className={className}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("grid items-start gap-4", className)}
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="flex space-x-2"
                  >
                    <FormItem className="basis-1/2">
                      <FormControl>
                        <RadioGroupItem
                          value={$Enums.Role.ADMIN}
                          id={$Enums.Role.ADMIN}
                          className="peer sr-only"
                        />
                      </FormControl>
                      <Label
                        htmlFor={$Enums.Role.ADMIN}
                        className="flex items-center justify-center space-x-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Upload className="w-4" />
                        <span>ADMIN</span>
                      </Label>
                    </FormItem>
                    <FormItem className="basis-1/2">
                      <FormControl>
                        <RadioGroupItem
                          value={$Enums.Role.NON_ADMIN}
                          id={$Enums.Role.NON_ADMIN}
                          className="peer sr-only"
                        />
                      </FormControl>
                      <Label
                        htmlFor={$Enums.Role.NON_ADMIN}
                        className="flex items-center justify-center space-x-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Download className="w-4" />
                        <span>NON-ADMIN</span>
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </form>
        {errorMessage && (
          <div className="flex text-red-500">
            <AlertCircle className="mr-1 w-5" />
            <p className="font-semibold">{errorMessage}</p>
          </div>
        )}
      </Form>
    </div>
  );
}
