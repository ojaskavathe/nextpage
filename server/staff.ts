"use server";

import { z } from "zod";
import { prisma } from "./db";
import { supportCreateSchema, supportUpdateSchema } from "@/lib/schema";
import { Support } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth, signOut, update } from "@/auth";

export const currentStaff = async () => {
  const session = await auth();
  return session?.user!;
};

export const createSupport = async (
  input: z.infer<typeof supportCreateSchema>,
) => {
  let out: {
    data: Support | null;
    error: number;
    message: string;
  };

  if (!supportCreateSchema.safeParse(input).success) {
    out = {
      data: null,
      error: 1,
      message: "Form couldn't be validated",
    };
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
      };
    }

    const newSupport = await prisma.support.create({
      data: {
        username: input.username,
        password: input.password,
        role: input.role,
      },
    });

    revalidatePath("/admin");

    return {
      data: newSupport,
      error: 0,
      message: "u gucci",
    };
  } catch (e) {
    return {
      data: null,
      error: 5,
      message: "[SERVER]: Something went wrong",
    };
  }
};

export const updateSupport = async (
  input: z.infer<typeof supportUpdateSchema>,
) => {
  let out: {
    data: Support | null;
    error: number;
    message: string;
  };

  if (!supportUpdateSchema.safeParse(input).success) {
    out = {
      data: null,
      error: 1,
      message: "Form couldn't be validated",
    };
    return out;
  }

  const current = await currentStaff();

  try {
    const support = await prisma.support.findUnique({
      where: {
        id: input.id,
      },
    });

    if (support!.username != input.username) {
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
        };
      }
    }

    const newSupport = await prisma.support.update({
      data: {
        username: input.username,
        password: input.password,
        role: input.role,
      },
      where: {
        id: input.id,
      },
    });

    if (current.id == input.id) {
      await update({
        user: { ...newSupport },
      });
    }

    revalidatePath("/admin", "layout");
    revalidatePath(`/admin/staff/${support?.username}`);
    revalidatePath(`/admin/staff/${newSupport?.username}`);

    return {
      data: newSupport,
      error: 0,
      message: "u gucci",
    };
  } catch (e) {
    return {
      data: null,
      error: 5,
      message: "[SERVER]: Something went wrong",
    };
  }
};

export const deleteSupport = async (supportId: string) => {
  const support = await prisma.support.findFirst({
    where: {
      id: supportId,
    },
  });

  if (!support) {
    return {
      error: 1,
      message: "No support found with ID.",
    };
  }

  const current = await currentStaff();

  try {
    const legacy = await fetchSupport("legacy");
    if (!legacy) {
      return {
        data: null,
        error: 1,
        message: "[SERVER]: Legacy staff not found",
      };
    }

    await prisma.transaction.updateMany({
      where: {
        supportId: supportId,
      },
      data: {
        supportId: legacy.id,
      },
    });

    await prisma.footfall.updateMany({
      where: {
        supportId: supportId,
      },
      data: {
        supportId: legacy.id,
      },
    });

    await prisma.expense.updateMany({
      where: {
        supportId: supportId,
      },
      data: {
        supportId: legacy.id,
      },
    });

    await prisma.cashReport.updateMany({
      where: {
        supportId: supportId,
      },
      data: {
        supportId: legacy.id,
      },
    });

    await prisma.support.delete({
      where: {
        id: supportId,
      },
    });

    if (current.id === supportId) {
      signOut();
    }

    revalidatePath("/admin/staff", "layout");
  } catch (e) {
    return null;
  }
};

export const fetchSupport = async (supportId: string) => {
  try {
    return await prisma.support.findUnique({
      include: {
        footfalls: true,
        transactions: true,
      },
      where: {
        username: supportId,
      },
    });
  } catch (e) {
    return null;
  }
};

export const fetchSupports = async () => {
  try {
    return await prisma.support.findMany({
      include: {
        footfalls: true,
        transactions: true,
      },
    });
  } catch (e) {
    return [];
  }
};

export const fetchTransactions = async () => {
  try {
    return await prisma.transaction.findMany({
      include: {
        patron: true,
        support: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (e) {
    return null;
  }
};

export const fetchFootfall = async () => {
  try {
    return await prisma.footfall.findMany({
      include: {
        patron: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (e) {
    return [];
  }
};

export const fetchCheckouts = async (patronId?: number) => {
  if (patronId) {
    try {
      return await prisma.checkout.findMany({
        where: {
          patronId,
        },
        orderBy: {
          checked_out: "desc",
        },
      });
    } catch (e) {
      return [];
    }
  }
  try {
    return await prisma.checkout.findMany({
      orderBy: {
        checked_out: "desc",
      },
    });
  } catch (e) {
    return [];
  }
};
