import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PatronFull, cn, sr_id } from "@/lib/utils";
import { CircleUser, Fingerprint, Mail, Library, TimerReset, BookOpen, HardDriveUpload, HardDriveDownload } from "lucide-react";

export function RenewPatronDetails({ patron, className }: { patron: PatronFull, className: string }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Patron</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between flex-wrap space-y-1'>
          <div className='flex flex-col space-y-1'>
            <div className='text-sm font-normal flex items-center'>
              <CircleUser className='w-4' />
              <span className='pl-2'>{patron.name}</span>
            </div>
            <div className='text-sm font-normal flex items-center'>
              <Fingerprint className='w-4' />
              <span className='pl-2'>{sr_id(patron.id)}</span>
            </div>
            <div className='text-sm font-normal flex items-center'>
              <Mail className='w-4' />
              <span className='pl-2'>{patron.email}</span>
            </div>
            <div className='text-sm font-normal flex items-center'>
              <Library className='w-4' />
              <span className='pl-2'>
                <span className='font-semibold'>Plan: </span>
                {`${patron.subscription?.plan} Books`}
              </span>
            </div>
            <div className='text-sm font-normal flex items-center'>
              <TimerReset className='w-4' />
              <span className='pl-2'><span className='font-semibold'>{`Expires on: `}</span>
                {patron.subscription?.expiryDate.toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
          <div className='flex flex-col space-y-1'>
            <div className='text-sm font-normal flex items-center'>
              <BookOpen className='w-4' />
              <span className='pl-2'>
                <span className='font-semibold'>In hand: </span>
                {`${patron.subscription?.booksInHand || 0} Books`}
              </span>
            </div>
            <div className='text-sm font-normal flex items-center'>
              <HardDriveUpload className='w-4' />
              <span className='pl-2'><span className='font-semibold'>{`Last Issued: `}</span>
                {patron.subscription?.lastIssued
                  ? patron.subscription.lastIssued.toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' })
                  : 'Not Found'}
              </span>
            </div>
            <div className='text-sm font-normal flex items-center'>
              <HardDriveDownload className='w-4' />
              <span className='pl-2'><span className='font-semibold'>{`Last Returned: `}</span>
                {patron.subscription?.lastReturned
                  ? patron.subscription.lastReturned.toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' })
                  : 'Not Found'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}