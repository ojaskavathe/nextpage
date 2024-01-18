import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default async function searchLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Find Patrons</h3>
        <p className="text-sm text-muted-foreground">
          Search for and edit Patron data.
        </p>
      </div>
      <Separator />
      <div className='flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0'>
        <div className='basis-1/2'>
          <Skeleton className="h-10" />
          <Separator className="mt-4" />
        </div>
        <div className='basis-1/2'>
          <Skeleton className="basis-1/2 h-72"/>
        </div>
      </div>
    </div>
  )
}