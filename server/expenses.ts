"use server";

import { prisma } from "./db";

export async function getCategories() {
  return prisma.expenseCategory.findMany();
}

export async function addCategory(category: string) {
  await prisma.expenseCategory.create({
    data: {
      name: category
    }
  })
}

export async function removeCategory(id: string) {
  await prisma.expenseCategory.delete({
    where: {
      id: id
    }
  })
}
