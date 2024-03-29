"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { $Enums } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useMediaQuery } from "@/hooks/use-media-query";
import { footfallFormSchema, supportCreateSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

import { AlertCircle, Download, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupport } from "@/server/staff";

export function SupportCreateDialog({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className={cn(className)} variant="default">
            Create
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Support</DialogTitle>
            <DialogDescription>Create a member of staff</DialogDescription>
          </DialogHeader>
          <SupportCreateForm isDesktop={isDesktop} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className={cn(className)} variant="default">
          Create
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[95%]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Support</DrawerTitle>
          <DrawerDescription>Create a member of staff</DrawerDescription>
        </DrawerHeader>
        <SupportCreateForm
          className="px-4 overflow-auto"
          isDesktop={isDesktop}
          setOpen={setOpen}
        />
      </DrawerContent>
    </Drawer>
  );
}

function SupportCreateForm({
  className,
  setOpen,
  isDesktop,
}: {
  className?: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isDesktop: boolean;
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const { refresh } = useRouter();

  const form = useForm<z.infer<typeof supportCreateSchema>>({
    resolver: zodResolver(supportCreateSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "NON_ADMIN",
    },
  });

  const onSubmit = async (data: z.infer<typeof supportCreateSchema>) => {
    const res = await createSupport(data);

    if (res.error) setErrorMessage(res.message);
    else {
      setOpen(false);
      refresh();
      toast.success("Support created", {
        description: `${data.username} is now a staff member.`,
      });
    }
  };

  return (
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

        {isDesktop ? (
          <DialogFooter className="pt-2">
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              Submit
            </Button>
          </DialogFooter>
        ) : (
          <DrawerFooter className="pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          </DrawerFooter>
        )}
      </form>
      {errorMessage && (
        <div className="flex text-red-500">
          <AlertCircle className="mr-1 w-5" />
          <p className="font-semibold">{errorMessage}</p>
        </div>
      )}
    </Form>
  );
}
