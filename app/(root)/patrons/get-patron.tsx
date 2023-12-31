"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { searchPatrons } from '@/lib/actions';
import { Patron } from '@prisma/client';
import { sr_id } from '@/lib/utils';
import { Fingerprint, Mail } from 'lucide-react';
import Link from 'next/link';

export default function GetPatron() {

  const delay = 500;
  const [searchString, setSearchString] = useState('');

  const [patrons, setPatrons] = useState<Patron[]>([]);

  // debouncing the search query
  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      const v = z.string().min(1).safeParse(searchString);
      if(v.success) {
        searchPatrons(searchString).then((results) => {
          setPatrons(results);
        });
      } 
      setPatrons([]);
    }, delay);

    return () => clearTimeout(fetchTimeout);
  }, [searchString])
  
  return (
    <div>
      <Input
        placeholder="ID / Name / Email" 
        spellCheck="false"
        onChange={(e) => { setSearchString(e.target.value) }}
      />
      <div className='border rounded-md flex-col mt-4'>
      {patrons.map((p) => (
        <Link
          href={`/patrons/${p.id}`} 
          key={p.id} 
          className='flex flex-col items-start w-full pl-4 py-2 first:pt-4 last:pb-4 hover:bg-muted'
        >
          <div className='font-semibold'>{p.name}</div>
          <div className='text-sm font-normal flex items-center'>
            <Fingerprint className='w-4'/>
            <span className='pl-2'>{sr_id(p.id)}</span>
          </div>
          <div className='text-sm font-normal flex items-center'>
            <Mail className='w-4'/>
            <span className='pl-2'>{p.email}</span>
          </div>
        </Link>
      ))}
      </div>
    </div>
  )
}