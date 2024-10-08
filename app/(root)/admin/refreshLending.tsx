"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cronRefresh } from "@/server/cron/cron";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export default function RefreshLending() {
  const [open, setOpen] = useState(false)

  const [isPending, startTransition] = useTransition();
  function handleAction() {
    startTransition(async () => {
      await cronRefresh();
    })
  }

  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return
    }
    if(isPending) return;
    setOpen(false)
    toast.success("Lending and Checkout Updated!")
  }, [isPending])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Refresh Lending</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Refresh Lending</DialogTitle>
          <DialogDescription>
            This might take a while. Are you sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => {handleAction()}} disabled={isPending} type="submit">Yes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
