"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { z } from "zod";
import { BookOpen, Fingerprint, HardDriveDownload, HardDriveUpload, Library, Mail, TimerReset } from 'lucide-react';
import { Prisma } from '@prisma/client';

import { Input } from "@/components/ui/input";
import { sr_id } from '@/lib/utils';
import { searchPatrons } from '@/server/patron';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type PatronFull = Prisma.PatronGetPayload<{ include: { subscription: true } }>;


export default function GetPatron() {

  const delay = 500;
  const [searchString, setSearchString] = useState('');

  const [patrons, setPatrons] = useState<PatronFull[]>([]);
  const [patron, setPatron] = useState<PatronFull>();

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
              <div className='flex justify-between flex-wrap space-y-1'>
                <div className='flex flex-col space-y-1'>
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
              <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8'>
                <Link
                  href={`/patrons/${patron.id}`}
                  className='basis-1/3'
                >
                  <Button className='w-full'>Edit</Button>
                </Link>
                <Link
                  href={`/patrons/${patron.id}/renew`}
                  className='basis-1/3'
                >
                  <Button className='w-full'>Renew</Button>
                </Link>
                <Link
                  href={`/patrons/${patron.id}/renew`}
                  className='basis-1/3'
                >
                  <Button className='w-full'>Footfall</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>}
    </div>
  )
}