"use client";

import { useFormStatus } from "react-dom";

import { Button } from "./button";

interface SubmitButtonProps {
  className?: string,
  children?: React.ReactNode
}

export function SubmitButton(props: SubmitButtonProps) {

  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={props.className}
      aria-disabled={pending}
      disabled={pending}
    >
      {props.children}
    </Button>
  )
}