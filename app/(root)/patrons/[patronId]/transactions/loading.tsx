import { Skeleton } from "@/components/ui/skeleton";

export default async function TransactionLoading() {
  return (
    <div>
      <Skeleton className="h-48 w-full md:w-1/2 xl:w-2/3" />
      <Skeleton className="h-60 w-full mt-8" />
    </div>
  )
}