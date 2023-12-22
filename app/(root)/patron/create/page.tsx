"use client";

import { trpc } from "@/app/_trpc/client";

export default function PatronCreateForm() {

  const createPatronMutation = trpc.createPatron.useMutation();

  const handleCreatePatron = async () => {
    try {
      const lol = await createPatronMutation.mutateAsync({
        name: 'lmao',
        email: 'sddf@asdf.co',
        phone: '1231231234',
        plan: 3,
        duration: 3,
        mode: "UPI",
      });
      console.log(lol)
    } catch (error) {
      console.log(error);
    }
  } 

  return (
    <>
      <button onClick={handleCreatePatron} >lol</button>   
    </>
  )
}
