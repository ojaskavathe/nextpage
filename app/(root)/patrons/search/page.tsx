import { z } from "zod";

import GetPatron from "@/components/get-patron";
import { Separator } from "@/components/ui/separator";

import { PatronWithSub } from "@/lib/utils";
import { fetchPatron } from "@/server/patron";

export default async function PatronCreateForm({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  const searchedId = searchParams?.id;
  
  let queryPatron: PatronWithSub | undefined;
  
  const isId = !z.number().safeParse(searchedId).success;
  if (!isId || !searchedId) {
    queryPatron == undefined;
  } else {
    const id = parseInt(searchedId);
    queryPatron = await fetchPatron(id)
      .then((res) => {
        if (!res) return undefined
        const { transactions, ...p } = res;
        return p;
      })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Find Patrons</h3>
        <p className="text-sm text-muted-foreground">
          Search for and edit Patron data.
        </p>
      </div>
      <Separator />
      <GetPatron queryPatron={queryPatron} />
    </div>
  )
}

