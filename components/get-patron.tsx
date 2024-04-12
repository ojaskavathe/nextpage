"use client";

import {
  usePathname,
  useRouter
} from "next/navigation";
import {
  useEffect,
  useState
} from "react";
import { z } from "zod";

import { PatronDetails } from "@/components/patron-details";
import { Input } from "@/components/ui/input";

import {
  PatronWithSub,
  sr_id
} from "@/lib/utils";
import { searchPatrons } from "@/server/patron";

import {
  Fingerprint,
  Mail
} from "lucide-react";

export default function GetPatron({ queryPatron }: { queryPatron?: PatronWithSub }) {

  const router = useRouter()
  const pathname = usePathname()

  
  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams()
    params.set(name, value)
    
    return params.toString()
  }
  
  const delay = 300;
  const [searchString, setSearchString] = useState('');
  
  const [patrons, setPatrons] = useState<PatronWithSub[]>([]);
  const [patron, setPatron] = useState<PatronWithSub | undefined>(queryPatron);

  // reset Patron on re-render
  useEffect(() => {
    setPatron(queryPatron);
  }, [queryPatron]);

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
                router.push(pathname + '?' + createQueryString('id', p.id.toString()))
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
          <PatronDetails patron={patron} />
        </div>}
    </div>
  )
}
