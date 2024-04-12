import { Prisma } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type PatronFull = Prisma.PatronGetPayload<{
  include: { subscription: true; transactions: true; addons: true; };
}>;
export type PatronWithSub = Prisma.PatronGetPayload<{
  include: { subscription: true, addons: true };
}>;
export type TransactionWithPatron = Prisma.TransactionGetPayload<{
  include: { patron: true };
}>;
export type TransactionWithSupport = Prisma.TransactionGetPayload<{
  include: { patron: true; support: true };
}>;
export type FootfallWithPatron = Prisma.FootfallGetPayload<{
  include: { patron: true };
}>;
export type CheckoutWithPatron = Prisma.CheckoutGetPayload<{
  include: { patron: true };
}>;
export type SupportFull = Prisma.SupportGetPayload<{
  include: { transactions:true; footfalls: true };
}>;

export const dateTimeFormat: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: "numeric",
  minute: "numeric",
  timeZone: "Asia/Kolkata"
}

export const dateFormat: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  timeZone: "Asia/Kolkata"
}

export const plans = [1, 2, 3, 4, 5, 6];
export const durations = [1, 3, 6, 12];
export const addonDurations = [1, 2, 3, 4];

export const freeDDs = [0, 0, 2, 4];
export const holidays = [0, 0, 1, 2];
export const discounts = [0, 0.05, 0.1, 0.2];

export const fee = [300, 400, 500, 600, 700, 800];
export const addonFee = 100;
export const DDFees = 25;

export const registrationFees = 199;
export const refundableDeposit = 499;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sr_id(id: number) {
  return `M${id.toString().padStart(6, "0")}`;
}

export async function wait(time: number = 1000) {
  await new Promise((resolve) => setTimeout(resolve, time));
}

export const objectMap = (obj: any, fn: any) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));
