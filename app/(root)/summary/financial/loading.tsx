import { Skeleton } from "@/components/ui/skeleton";

export default async function TransactionLoading() {
  return (
    <div>
      <Skeleton className="h-60 w-full mt-8" />
    </div>
  )
}