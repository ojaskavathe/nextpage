"use client"

import {
  useFormState,
  useFormStatus
} from "react-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

import { authenticate } from "@/lib/actions";
import { LoginFormSchema } from "@/lib/schema";

import { AlertCircle } from "lucide-react";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {

  const [ errorMessage, dispatch ] = useFormState(authenticate, undefined);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      id: "",
      password: "",
      callbackUrl: callbackUrl
    },
  })

  return (
    <Form {...form}>
      <form 
        action={dispatch}
        className="w-2/3 py-8"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input {...field} className="mt-0"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton className="mt-6 w-full">Login</SubmitButton>
        { errorMessage && 
          <div className="flex text-red-500 mt-4">
            <AlertCircle className="mr-1 w-5"/>
            <p className="font-semibold">
              {errorMessage}
            </p>
          </div>}
      </form>
    </Form>
  )
}
