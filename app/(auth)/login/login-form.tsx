"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input"
import { authenticate } from "@/lib/actions";
import { LoginFormSchema } from "@/lib/schema";
import { AlertCircle } from "lucide-react";

export function LoginForm() {

  const [ errorMessage, dispatch ] = useFormState(authenticate, undefined);
  const { pending } = useFormStatus(); 

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      id: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    const formData = new FormData();

    formData.append('id', data.id);
    formData.append('password', data.password);
    dispatch(formData);
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
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
        <Button type="submit" className="mt-6 w-full" aria-disabled={pending}>Login</Button>
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
