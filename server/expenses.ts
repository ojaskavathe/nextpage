"use server";

import { z } from "zod";
import { prisma } from "./db";
import { expenseSchema } from "@/lib/schema";
import { currentStaff } from "./staff";

export async function getExpenses() {
  return prisma.expense.findMany({
    include: {
      support: true,
    }
  });
}

export async function createExpense(input: z.infer<typeof expenseSchema>) {
  if (!expenseSchema.safeParse(input).success) {
    return {
      error: 1,
      message: "Form couldn't be validated",
    };
  }

  const staff = await currentStaff();

  try {
    await prisma.expense.create({
      data: {
        mode: input.mode,
        amount: input.amount || 0,
        category: input.category,
        support: {
          connect: {
            id: staff.id
          }
        },
        remarks: input.remarks,
      }
    })
    return {
      error: 0,
      message: "u gucci"
    }
  } catch (e) {
    return {
      error: 5,
      message: "Server Error",
    };
  }
}

export async function getCategories() {
  return prisma.expenseCategory.findMany();
}

export async function addCategory(name: string) {
  try {
    return await prisma.expenseCategory.create({
      data: {
        name,
      },
    });
  } catch (e) {}
}

export async function removeCategory(name: string) {
  try {
    await prisma.expenseCategory.delete({
      where: {
        name,
      },
    });
  } catch (e) {}
}
