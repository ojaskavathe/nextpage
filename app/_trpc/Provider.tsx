"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { trpc } from "./client";
import { httpBatchLink } from "@trpc/client";

export default function Provider(
  { children }: { children: React.ReactNode }
) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() => 
    trpc.createClient({
      links: [
        httpBatchLink({
          // probably use the full url here instead of a relative one 
          url: '/api/trpc'
        })
      ]
    })
  );
  
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}