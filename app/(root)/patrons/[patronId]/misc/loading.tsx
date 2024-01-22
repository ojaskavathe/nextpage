import { Skeleton } from "@/components/ui/skeleton";

export default async function miscLoading() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Skeleton className="md:basis-3/5 w-full h-96 md:h-72" />
        <Skeleton className="md:basis-3/5 w-full h-96 md:h-48" />
      </div>

    </div>
  )
}