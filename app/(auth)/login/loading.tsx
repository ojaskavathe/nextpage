import { Skeleton } from "@/components/ui/skeleton";

export default async function loginLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-80 flex items-center justify-center border rounded-2xl">
        <Skeleton className="w-full h-72" />
      </div>
    </div>
  )
}