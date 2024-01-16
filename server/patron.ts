"use server"

import { z } from "zod";

import {
  $Enums,
  Footfall,
  Patron
} from "@prisma/client";

import {
  footfallFormSchema,
  patronCreateSchema,
  patronRenewSchema,
  patronUpdateSchema
} from "@/lib/schema";
import {
  DDFees,
  discounts,
  durations,
  fee,
  freeDDs,
  holidays,
  PatronWithSub,
  refundableDeposit,
  registrationFees,
  sr_id
} from "@/lib/utils";

import { prisma } from "./db";
import PatronUpdateForm from "@/app/(root)/patrons/[patronId]/patron-update-form";

export const fetchPatron = async (patronId: number) => {
  const isId = await z.number().safeParseAsync(patronId);
  if (isId.success) {
    try {
      return await prisma.patron.findUnique({
        where: {
          id: patronId
        },
        include: {
          subscription: true,
          transactions: true
        }
      });
    } catch (e) {
      return null;
    }
  }

  return null;
}

export const searchPatrons = async (searchString: string) => {
  const isId = await z.string().regex(/^M\d+$/).safeParseAsync(searchString);
  if (isId.success) {
    try {
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
    } catch (e) {
      return [];
    }
  }

  // if not an ID, check name and email
  const v = await z.string().min(1).safeParseAsync(searchString);
  if (v.success) {
    try {
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

    } catch (e) {
      return []
    }
  }
  return [];
}

export async function createPatron(input: z.infer<typeof patronCreateSchema>) {

  let out: {
    data: Patron | null,
    error: number,
    message: string,
  }

  if (!patronCreateSchema.safeParse(input).success) {
    out = {
      data: null,
      error: 1,
      message: 'Form couldn\'t be validated',
    }
    return out;
  }

  const today = new Date();
  const exp = new Date(new Date(today).setMonth(today.getMonth() + input.duration));

  const readingFee = fee[input.plan - 1] * input.duration;
  const DDFee = (input.paidDD || 0) * DDFees;

  const index = durations.indexOf(input.duration);
  const freeDD = freeDDs[index];
  const freeHoliday = holidays[index];
  const discount = readingFee * discounts[index];

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
        altPhone: input.altPhone,
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
              DDFees: DDFee,
              discount: discount,
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

export async function renewPatron(input: z.infer<typeof patronRenewSchema>): Promise<{
  error: number,
  message: string,
}> {

  const validity = patronRenewSchema.safeParse(input);

  if (!validity.success) {
    return {
      error: 1,
      message: "Form couldn\'t be validated" 
    }
  }

  const patron = await fetchPatron(input.id);
  if (!patron) {
    return {
      error: 2,
      message: 'Patron doesn\'t exist'
    }
  }

  const oldPlan = patron.subscription!.plan;

  const today = new Date();
  const oldExpiry = patron.subscription!.expiryDate;

  let numDays = 0;
  const isPatronLate = (patron.subscription!.booksInHand > 0) && (oldExpiry < today);
  if (isPatronLate) {
    numDays = Math.floor(
      (today.valueOf() - oldExpiry.valueOf())
      / (1000 * 60 * 60 * 24)
    );
  }

  const pastDues = input.renewFromExpiry
    ? 0
    : Math.floor(fee[input.plan - 1] * numDays / 30)

  const newExpiry = isPatronLate
    ? input.renewFromExpiry
      ? new Date(new Date(oldExpiry).setMonth(oldExpiry.getMonth() + input.duration))
      : new Date(today.setMonth(today.getMonth() + input.duration))
    : new Date(new Date(oldExpiry).setMonth(oldExpiry.getMonth() + input.duration))

  const readingFee = fee[input.plan - 1] * input.duration;
  const DDFee = (input.paidDD || 0) * DDFees;

  const index = durations.indexOf(input.duration);
  const freeDD = freeDDs[index];
  const freeHoliday = holidays[index];
  const discount = readingFee * discounts[index];

  const total = readingFee + pastDues - discount - (input.adjust || 0);

  const totalPaidDDs = patron.subscription!.paidDD + (input.paidDD || 0);

  try {
    const renewedPatron = await prisma.patron.update({
      data: {
        subscription: {
          update: {
            plan: input.plan,
            expiryDate: newExpiry,
            freeDD: freeDD,
            paidDD: totalPaidDDs,
            freeHoliday: freeHoliday,
            offer: input.offer
          }
        },
        transactions: {
          create: [
            {
              type: $Enums.TransactionType.RENEWAL,
              mode: input.mode,

              readingFees: readingFee,
              DDFees: DDFee,
              discount: discount,
              pastDues: pastDues,
              adjust: input.adjust || 0,
              reason: input.reason || null,
              offer: input.offer || null,
              remarks: input.remarks || null,

              netPayable: total,

              oldPlan: oldPlan,
              newPlan: input.plan,
              oldExpiry: oldExpiry,
              newExpiry: newExpiry,
              attendedBy: 'Server'
            }
          ]
        }
      },
      where: {
        id: input.id
      }
    });

    return {
      error: 0,
      message: 'u gucci',
    }

  } catch (e) {
    return {
      error: 5,
      message: '[SERVER]: Something went wrong',
    }
  }
}

export async function updatePatron(input: z.infer<typeof patronUpdateSchema>): Promise<{
  error: number,
  message: string,
}> {

  const validity = await patronUpdateSchema.safeParseAsync(input);

  if (validity.success) {
    return {
      error: 1,
      message: "Failed to validate Patron Data."
    }
  }

  const { id, ...props } = input;

  try {
    await prisma.patron.update({
      data: props,
      where: {
        id
      }
    })

    return {
      error: 0,
      message: "u gucci"
    }
  } catch (e) {
    return {
      error: 5,
      message: '[SERVER]: Something went wrong'
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
      error: 5,
      message: `[SERVER]: There was an error inserting footfall for user: ${sr_id(input.id)}`
    }
  }
}