"use server"

import { z } from "zod";
import { prisma } from "./db";
import { $Enums, Footfall, FootfallType, Patron } from "@prisma/client";
import { footfallFormSchema, patronSchema } from "@/lib/schema";
import { sr_id } from "@/lib/utils";

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

export const searchPatrons = async (searchString: string) => {
  const isId = await z.string().regex(/^M\d+$/).safeParseAsync(searchString);
  if (isId.success) {
    return await prisma.patron.findMany({
      where: {
        id: {
          equals: parseInt(searchString.substring(1))
        }
      },
      include: {
        subscription: true
      },
      take: 5
    });
  }

  // if not an ID, check name and email
  const v = await z.string().min(1).safeParseAsync(searchString);
  if (v.success) {
    return await prisma.patron.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchString,
              mode: "insensitive" // case-insensitive
            }
          },
          {
            email: {
              contains: searchString,
              mode: "insensitive"
            }
          }
        ]
      },
      include: {
        subscription: true
      },
      take: 5
    });
  }
  return [];
}

export async function createPatron(input: z.infer<typeof patronSchema>) {

  let out: {
    data: Patron | null,
    error: number,
    message: string,
  }

  if (!patronSchema.safeParse(input).success) {
    out = {
      data: null,
      error: 1,
      message: 'Form couldn\'t be validated',
    }
    return out;
  }

  const today = new Date();
  const exp = new Date(today.setMonth(today.getMonth() + input.duration));

  const readingFee = fee[input.plan - 1] * input.duration;

  const index = months.indexOf(input.duration);
  const freeDD = dd[index];
  const freeHoliday = hol[index];
  const discount = readingFee * dis[index];

  const total = readingFee + registrationFees + refundableDeposit - discount - (input.adjust || 0);

  try {
    const exists = await prisma.patron.findFirst({
      where: {
        OR: [
          {
            phone: input.phone
          },
          {
            email: {
              equals: input.email,
              mode: "insensitive"
            }
          }
        ]
      },
    });

    if (exists) {
      const which = exists.email === input.email ? 'Email' : 'Phone'

      return {
        data: null,
        error: 2,
        message: `${which} already exists!`,
      }
    }

    const newPatron = await prisma.patron.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        altPhone: input.altPhone || null,
        address: input.address || null,
        pincode: input.pincode || null,
        joiningDate: today,
        whatsapp: input.whatsapp,
        deposit: refundableDeposit,
        remarks: input.remarks || null,
        subscription: {
          create: {
            plan: input.plan,
            expiryDate: exp,
            freeDD: freeDD,
            paidDD: input.paidDD || 0,
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
              pastDues: input.pastDues || 0,
              adjust: input.adjust || 0,
              reason: input.reason || null,
              offer: input.offer || null,
              remarks: input.remarks || null,

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
    });

    return {
      data: newPatron,
      error: 0,
      message: 'u gucci',
    }

  } catch (e) {
    return {
      data: null,
      error: 5,
      message: '[SERVER]: Something went wrong',
    }
  }
}

export async function createFootfall(input: z.infer<typeof footfallFormSchema>): Promise<{
  data: Footfall | null,
  error: number,
  message: string,
}> {
  if (!footfallFormSchema.safeParse(input).success) {
    return {
      data: null,
      error: 1,
      message: "Failed to validate Footfall Data."
    }
  }

  try {

    const data: Footfall = input.isDD
      ? await prisma.footfall.create({
        data: {
          patronId: input.id,
          type: input.type,
          offer: input.offer,
          remarks: input.remarks,
          isDD: true,
          delivery: {
            create: {
              patronId: input.id,
              type: input.DDType,
              numBooks: input.numBooks,
              scheduledFor: input.scheduledDate,
              message: input.message
            }
          },
          createdAt: input.scheduledDate
        }
      }) : await prisma.footfall.create({
        data: {
          patronId: input.id,
          type: input.type,
          offer: input.offer,
          remarks: input.remarks,
          isDD: false,
        }
      })
    return {
      data: data,
      error: 0,
      message: "u gucci"
    }
  } catch (e) {
    return {
      data: null,
      error: 2,
      message: `There was an error inserting footfall for user: ${sr_id(input.id)}`
    }
  }
}