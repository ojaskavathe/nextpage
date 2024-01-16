"use client";

import Link from "next/link";
import {
  useEffect,
  useState
} from "react";
import { z } from "zod";

import { FootfallDialog } from "@/components/footfall-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  PatronWithSub,
  sr_id
} from "@/lib/utils";
import { searchPatrons } from "@/server/patron";

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

export default function GetPatron() {

  const delay = 500;
  const [searchString, setSearchString] = useState('');

  const [patrons, setPatrons] = useState<PatronWithSub[]>([]);
  const [patron, setPatron] = useState<PatronWithSub>();

  // debouncing the search query
  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      const v = z.string().min(1).safeParse(searchString);
      if (v.success) {
        searchPatrons(searchString).then((results) => {
          setPatrons(results);
        });
      }
      setPatrons([]);
    }, delay);

    return () => clearTimeout(fetchTimeout);
  }, [searchString])

  return (
    <div className='flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0'>
      <div className='basis-1/2'>
        <Input
          name="patron"
          placeholder="ID / Name / Email"
          spellCheck="false"
          onChange={(e) => { setSearchString(e.target.value) }}
        />
        <div className='border rounded-md flex-col mt-4'>
          {patrons.map((p) => (
            <button
              key={p.id}
              className='flex flex-col items-start w-full pl-4 py-2 first:pt-4 last:pb-4 hover:bg-muted'
              onClick={() => {
                setPatron(p)
                setPatrons([])
              }}
            >
              <div className='font-semibold'>{p.name}</div>
              <div className='text-sm font-normal flex items-center'>
                <Fingerprint className='w-4' />
                <span className='pl-2'>{sr_id(p.id)}</span>
              </div>
              <div className='text-sm font-normal flex items-center'>
                <Mail className='w-4' />
                <span className='pl-2'>{p.email}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!!patron &&
        <div className='basis-1/2'>
          <Card>
            <CardHeader>
              <CardTitle>{patron.name}</CardTitle>
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
              <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8'>
                <Link
                  href={`/patrons/${patron.id}`}
                  className='basis-1/3'
                >
                  <Button variant="default" className='w-full'>Edit</Button>
                </Link>
                <Link
                  href={`/patrons/${patron.id}/renew`}
                  className='basis-1/3'
                >
                  <Button variant="default" className='w-full'>Renew</Button>
                </Link>
                <FootfallDialog className='basis-1/3' patron={patron}/>
              </div>
            </CardContent>
          </Card>
        </div>}
    </div>
  )
}