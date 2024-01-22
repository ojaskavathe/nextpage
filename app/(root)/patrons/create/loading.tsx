import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default async function createLoading() {
  return (
    <div className="xl:w-2/3">
      <div className="mr-2 text-background">

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="basis-1/3 w-full flex-col space-y-2">
            <Label>Plan</Label>
            <Skeleton className="w-full h-10" />
          </div>
          <div className="basis-1/3 w-full flex-col space-y-2">
            <Label>Duration</Label>
            <Skeleton className="w-full h-10" />
          </div>
          <div className="basis-1/3 w-full flex-col space-y-2">
            <Label>Paid DD</Label>
            <Skeleton className="w-full h-10" />
          </div>
        </div>

        <div className="mt-4">
          <Label>Payment Mode</Label>
          <Skeleton className="mt-4 w-full h-20" />
        </div>
        <div className="mt-6">
          <Label>Offer</Label>
          <Skeleton className="mt-2 w-full h-10" />
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
          <div className="basis-1/2 w-full flex-col space-y-2">
            <Label>Adjust</Label>
            <Skeleton className="w-full h-10" />
          </div>
          <div className="basis-1/2 w-full flex-col space-y-2">
            <Label>Reason</Label>
            <Skeleton className="w-full h-10" />
          </div>
        </div>

        <Skeleton className="mt-8 w-full h-48" />

      </div>
    </div>
  )
}