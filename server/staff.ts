"use server"

import { z } from "zod";
import { prisma } from "./db";
import { supportCreateSchema } from "@/lib/schema";
import { Support } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export const currentStaff = async () => {
  const session = await auth();
  return session?.user!;
};

export const createSupport = async (input: z.infer<typeof supportCreateSchema>) => {
  let out: {
    data: Support | null,
    error: number,
    message: string,
  }

  if (!supportCreateSchema.safeParse(input).success) {
    out = {
      data: null,
      error: 1,
      message: 'Form couldn\'t be validated',
    }
    return out;
  }

  try {
    const exists = await prisma.support.findFirst({
      where: {
        username: input.username,
      },

    });

    if (exists) {
      return {
        data: null,
        error: 2,
        message: `${exists.username} already exists!`,
      }
    }

    const newSupport = await prisma.support.create({
      data: {
        username: input.username,
        password: input.password,
        role: input.role,
      }
    })

    revalidatePath('/admin');

    return {
      data: newSupport,
      error: 0,
      message: 'u gucci'
    }
  } catch (e) {
    return {
      data: null,
      error: 5,
      message: '[SERVER]: Something went wrong',
    }
  }
}

export const fetchSupport = async () => {
  try {
    return await prisma.support.findMany({
      include: {
        footfalls: true,
        transactions: true
      },
    });
  } catch (e) {
    return [];
  }
}

export const fetchTransactions = async () => {
  try {
    return await prisma.transaction.findMany({
      include: {
        patron: true,
        support: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  } catch (e) {
    return null;
  }
}

export const fetchFootfall = async () => {
  try {
    return await prisma.footfall.findMany({
      include: {
        patron: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  } catch (e) {
    return [];
  }
}

export const fetchCheckouts = async (patronId?: number) => {
  if (patronId) {
    try {
      return await prisma.checkout.findMany({
        where: {
          patronId
        },
        orderBy: {
          checked_out: "desc"
        }
      });
    } catch (e) {
      return [];
    }
  }
  try {
    return await prisma.checkout.findMany({
      orderBy: {
        checked_out: "desc"
      }
    });
  } catch (e) {
    return [];
  }
}
