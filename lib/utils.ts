import { Prisma } from "@prisma/client";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export type PatronFull = Prisma.PatronGetPayload<{ include: { subscription: true, transactions: true } }>;
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sr_id(id: number) {
  return `M${id.toString().padStart(6, '0')}`
}
