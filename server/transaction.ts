"use server";

import { z } from "zod";
import { prisma } from "./db";
import { transactionSchema } from "@/lib/schema";

export const fetchTransaction = async (patronId: number) => {
  const isId = await z.number().safeParseAsync(patronId);
  if (isId.success) {
    try {
      return await prisma.transaction.findUnique({
        where: {
          id: patronId,
        },
        include: {
          patron: true,
          support: true,
        },
      });
    } catch (e) {
      return null;
    }
  }

  return null;
};

export const editTransaction = async (
  input: z.infer<typeof transactionSchema>,
) => {
  const validity = await transactionSchema.safeParseAsync(input);

  if (!validity.success) {
    return {
      error: 1,
      message: "Form couldn't be validated",
    };
  }

  try {
    await prisma.transaction.update({
      data: {
        newPlan: input.newPlan || null,
        newExpiry: input.newExpiry || null,
        type: input.type,

        registration: input.registration || 0,
        deposit: input.deposit || 0,
        readingFees: input.readingFees || 0,
        DDFees: input.DDFees || 0,
        discount: input.discount || 0,
        pastDues: input.pastDues || 0,

        netPayable: input.netPayable || 0,
        adjust: input.adjust || 0,
        mode: input.mode,
        offer: input.offer,
      },
      where: {
        id: input.id,
      },
    });

    return {
      error: 0,
      message: "u gucci",
    };
  } catch (e) {
    return {
      error: 4,
      message: "Server Error",
    };
  }
};
