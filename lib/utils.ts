import { Prisma } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type PatronFull = Prisma.PatronGetPayload<{
  include: { subscription: true; transactions: true; addons: true };
}>;
export type PatronWithSub = Prisma.PatronGetPayload<{
  include: { subscription: true; addons: true };
}>;
export type TransactionWithPatron = Prisma.TransactionGetPayload<{
  include: { patron: true };
}>;
export type TransactionWithSupport = Prisma.TransactionGetPayload<{
  include: { patron: true; support: true };
}>;
export type FootfallWithPatron = Prisma.FootfallGetPayload<{
  include: { patron: true; support: true };
}>;
export type CheckoutWithPatron = Prisma.CheckoutGetPayload<{
  include: { patron: true };
}>;
export type SupportFull = Prisma.SupportGetPayload<{
  include: { transactions: true; footfalls: true };
}>;
export type ExpenseWithSupport = Prisma.ExpenseGetPayload<{
  include: { support: true };
}>;
export type CashReportWithSupport = Prisma.CashReportGetPayload<{
  include: { support: true };
}>;

export const dateTimeFormat: Intl.DateTimeFormatOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
  timeZone: "Asia/Kolkata",
};

export const dateFormat: Intl.DateTimeFormatOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Kolkata",
};

export const timeFormat: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
  timeZone: "Asia/Kolkata",
};

export const followups = ["GETTING", "EXPIRED", "DORMANT", "ACTIVE"] as const;
export type T_Followup = (typeof followups)[number];

export type T_SummaryCount = { createdAt: Date, sum: number };

export const plans = [1, 2, 3, 4, 5, 6];
export const durations = [1, 2, 3, 6, 12];
export const addonDurations = [1, 2, 3, 4];

export const freeDDs = [0, 0, 0, 2, 4];
export const holidays = [0, 0, 0, 1, 2];
export const discounts = [0, 0, 0.05, 0.1, 0.2];

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

export const followupMessage = (patron: PatronWithSub, type: T_Followup) => {
  switch (type) {
    case "GETTING":
      return `Dear ${patron.name} (${sr_id(patron.id)}),

Your *SimplyRead Library* subscription is *getting expired* on  *${patron.subscription!.expiryDate.toLocaleDateString("en-IN", dateFormat)}*. Kindly renew the same at the earliest.* 🙏🙏🙏

You can now check subscription plans at https://simplyread.in/plans/ and renew your subscription from home by paying through *Gpay, PhonePay, PayTM* on *9527971342* or *UPI* on *simplyread@upi*.

Feel free to contact us for any clarification you may need.

Team SimplyRead`;

    case "EXPIRED":
      return `Dear ${patron.name} (${sr_id(patron.id)}),

Your *SimplyRead Library* subscription has *expired* on *${patron.subscription!.expiryDate.toLocaleDateString("en-IN", dateFormat)}*. Kind request to renew the same at the earliest. 🙏🙏🙏 

You can now check subscription plans at https://simplyread.in/plans/ and renew your subscription from home by paying through *Gpay, PhonePay, PayTM* on *9527971342* or *UPI* on *simplyread@upi.* 

Feel free to contact us for any clarification you may need. 

Team SimplyRead`;

    case "DORMANT":
      return `Dear ${patron.name} (${sr_id(patron.id)}),

Your *SimplyRead Library* subscription is *expired* since *${patron.subscription!.expiryDate.toLocaleDateString("en-IN", dateFormat)}* and you are currently holding library books with you since *${patron.subscription!.lastIssued!.toLocaleDateString("en-IN", dateFormat)}* . Kind request to *exchange the books* and *renew subscription* at the earliest. 

You can now check subscription plans at https://simplyread.in/plans/ and renew your subscription from home by paying through Gpay, PhonePay, PayTM on 9527971342 or UPI on simplyread@upi. 

Feel free to contact us for any clarification you may need. *Look Forward for your urgent response.* 🙏🙏🙏  

Team SimplyRead`;

    case "ACTIVE":
      return `Dear ${patron.name} (${sr_id(patron.id)}),

This message is just to bring to your kind attention that you have *not exchanged* any Books/Magazines since *${patron.subscription!.lastIssued!.toLocaleDateString("en-IN", dateFormat)}*. 

Kind request for books exchange at the earliest. In case, you have *finished reading* and are *unable to visit our library* soon, please use our *home delivery service.* 

Thank you very much in advance🙏🏻

Team SimplyRead`;
  }
};
