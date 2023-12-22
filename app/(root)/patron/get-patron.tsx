"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { fetchPatron } from '@/lib/actions';
import { Patron } from '@prisma/client';
import { sr_id } from '@/lib/utils';
import { Fingerprint } from 'lucide-react';

export default function GetPatronForm() {

  const delay = 500;
  const [searchString, setSearchString] = useState('');

  const [patrons, setPatrons] = useState<Patron[]>([]);

  // debouncing the search query
  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      const v = z.string().min(1).safeParse(searchString);
      if(v.success) {
        fetchPatron(searchString).then((results) => {
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
        placeholder="ID / Name / Phone" 
        spellCheck="false"
        onChange={(e) => { setSearchString(e.target.value) }}
      />
      <div className='border rounded-md flex-col mt-4'>
      {patrons.map((p) => (
        <div key={p.id} className='pl-4 py-2 first:pt-4 last:pb-4 hover:bg-muted'>
          <div className='font-semibold'>{p.name}</div>
          <div className='text-sm font-normal flex items-center'>
            <Fingerprint className='w-4'/>
            <span className='pl-2'>{sr_id(p.id)}</span>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}