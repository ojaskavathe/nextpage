import { Prisma } from "@prisma/client";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export type PatronFull = Prisma.PatronGetPayload<{ include: { subscription: true, transactions: true } }>;
export type PatronWithSub = Prisma.PatronGetPayload<{ include: { subscription: true } }>;

export const plans = [1, 2, 3, 4, 5, 6];
export const durations = [1, 3, 6, 12];

export const freeDDs = [0, 0, 2, 4];
export const holidays = [0, 0, 1, 2];
export const discounts = [0, 0.05, 0.1, 0.2];

export const fee = [300, 400, 500, 600, 700, 800];
export const DDFees = 25;

export const registrationFees = 199;
export const refundableDeposit = 499;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sr_id(id: number) {
  return `M${id.toString().padStart(6, '0')}`
}

export async function wait(time: number = 1000) {
  await new Promise((resolve) => setTimeout(resolve, time))
}