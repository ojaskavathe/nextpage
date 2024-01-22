import { Skeleton } from "@/components/ui/skeleton";

export default async function createLoading() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Skeleton className="md:basis-3/5 w-full h-96 md:h-72" />
        <Skeleton className="md:basis-3/5 w-full h-96 md:h-48" />
      </div>

      <Skeleton className="2xl:w-1/2 mt-8 w-full h-48" />

    </div>
  )
}