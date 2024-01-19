import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import {
  cn,
  PatronWithSub,
  sr_id
} from "@/lib/utils";

import { FootfallDialog } from "./footfall-form";

import {
  Bike,
  BookOpen,
  Fingerprint,
  Gauge,
  HardDriveDownload,
  HardDriveUpload,
  Library,
  Mail,
  TimerReset,
  Truck
} from "lucide-react";

export function PatronDetails({ patron, readOnly, className }: { 
  patron: PatronWithSub, 
  readOnly?: boolean, 
  className?: string 
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>
          <Button className="text-lg font-semibold" variant="outline">
            <Link href={`/patrons/${patron.id}`}>{patron.name}</Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between flex-wrap gap-1'>
          <div className='flex flex-col space-y-1'>
            <div className='text-sm font-normal flex items-center'>
              <Gauge className='w-4' />
              <span className='pl-2 font-semibold'>
                {patron.subscription?.expiryDate! >= new Date()
                  ? <span className=''>ACTIVE</span>
                  : <span className='text-red-500'>EXPIRED</span>}
              </span>
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
            <div className='text-sm font-normal flex items-center'>
              <Bike className='w-4' />
              <span className='pl-2'>
                <span className='font-semibold'>Free Delivery: </span>
                {`${patron.subscription?.freeDD || 0}`}
              </span>
            </div>
            <div className='text-sm font-normal flex items-center'>
              <Truck className='w-4' />
              <span className='pl-2'>
                <span className='font-semibold'>Paid Delivery: </span>
                {`${patron.subscription?.paidDD || 0}`}
              </span>
            </div>
          </div>
        </div>
        {!readOnly && <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8'>
          <Link
            href={`/patrons/${patron.id}/renew`}
            className='basis-1/3'
          >
            <Button variant="default" className='w-full'>Renew</Button>
          </Link>
          <FootfallDialog className='basis-1/3' patron={patron} />
          <Link
            href={`/patrons/${patron.id}/misc`}
            className='basis-1/3'
          >
            <Button variant="default" className='w-full'>Misc</Button>
          </Link>
        </div>}
      </CardContent>
    </Card>
  )
}