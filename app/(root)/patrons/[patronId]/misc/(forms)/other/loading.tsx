import { Skeleton } from "@/components/ui/skeleton";

export default function MiscSuspense() {
  return (
    <div>
      <Skeleton className="w-full h-24 mt-8" />
      <Skeleton className="w-full h-48 mt-8" />
    </div>
  )
}