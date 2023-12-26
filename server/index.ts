"use server"

import { z } from "zod";
import { prisma } from "./db";
import { $Enums } from "@prisma/client";
import { NextResponse } from "next/server";
import { patronSchema } from "@/lib/schema";

const months = [1, 3, 6, 12];
const dd = [0, 0, 2, 4];
const hol = [0, 0, 1, 2];
const dis = [0, 0.05, 0.1, 0.2];

const fee = [300, 400, 500, 600, 700, 800];
const registrationFees = 199;
const refundableDeposit = 499;

export const fetchPatron = async (patronId: number) => {
  const isId = await z.number().safeParseAsync(patronId);
  if (isId.success) {
    return await prisma.patron.findUnique({
      where: {
        id: patronId
      },
      include: {
        subscription: true,
        transactions: true
      }
    });
  }

  return null;
}


export async function createPatron( input ) {

  if (!patronSchema.safeParse(input).success) {
    return null
  }

  const today = new Date();
  const exp = new Date(today.setMonth(today.getMonth() + input.duration));

  const readingFee = fee[input.plan - 1] * input.duration;

  const index = months.indexOf(input.duration);
  const freeDD = dd[index];
  const freeHoliday = hol[index];
  const discount = readingFee * dis[index];

  const total = readingFee + registrationFees + refundableDeposit - discount;

  const newPatron = await prisma.patron.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      pincode: input.pincode,
      joiningDate: today,
      whatsapp: input.whatsapp,
      deposit: refundableDeposit,
      remarks: input.remarks,
      subscription: {
        create: {
          plan: input.plan,
          expiryDate: exp,
          freeDD: freeDD,
          freeHoliday: freeHoliday,
          offer: input.offer
        }
      },
      transactions: {
        create: [
          {
            type: $Enums.TransactionType.SIGNUP,
            mode: input.mode,

            registration: registrationFees,
            deposit: refundableDeposit,
            readingFees: readingFee,
            discount: discount,
            pastDues: input.pastDues,
            adjust: input.adjust,
            reason: input.reason,
            offer: input.offer,
            remarks: input.remarks,

            netPayable: total,

            oldPlan: input.plan,
            newPlan: input.plan,
            oldExpiry: today,
            newExpiry: exp,
            attendedBy: 'Server'
          }
        ]
      }
    }
  })

  return NextResponse.json(newPatron)
}