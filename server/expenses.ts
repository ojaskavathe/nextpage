"use server";

import { z } from "zod";
import { prisma } from "./db";
import { cashReportSchema, expenseSchema } from "@/lib/schema";
import { currentStaff } from "./staff";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getExpenses() {
  const session = await auth();

  if (session?.user?.role != "ADMIN") {
    return prisma.expense.findMany({
      where: {
        mode: "CASH"
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      include: {
        support: true,
      },
    });
  }

  return prisma.expense.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    include: {
      support: true,
    },
  });
}

export async function getCashReports() {
  return prisma.cashReport.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    include: {
      support: true,
    },
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
            id: staff.id,
          },
        },
        remarks: input.remarks,
        createdAt: input.createdAt,
      },
    });

    revalidatePath("/expenses/add");
    revalidatePath("/expenses/summary");

    return {
      error: 0,
      message: "u gucci",
    };
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

export async function addCashReport(input: z.infer<typeof cashReportSchema>) {
  if (!cashReportSchema.safeParse(input).success) {
    return {
      error: 1,
      message: "Form couldn't be validated",
    };
  }

  const staff = await currentStaff();

  try {
    await prisma.cashReport.create({
      data: {
        amount: input.amount || 0,
        support: {
          connect: {
            id: staff.id,
          },
        },
      },
    });

    revalidatePath("/expenses/report");
    revalidatePath("/expenses/summary");

    return {
      error: 0,
      message: "u gucci",
    };
  } catch (e) {
    return {
      error: 5,
      message: "Server Error",
    };
  }
}

export async function getExpenseSummary() {
  // try {
  const reportedCash = await prisma.cashReport.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const expenses = await prisma.expense.findMany();
  const transactions = await prisma.transaction.findMany();
  if (reportedCash.length == 0) {
    return [];
  }

  return reportedCash.map((r, i, arr) => {
    if (i == arr.length - 1) {
      // for the first report, can't be checked against any previous reports
      const thisDaysExpenses = expenses.filter((e) => {
        return e.createdAt < r.createdAt && e.mode == "CASH";
      });
      let sumOfExpenses = 0;
      thisDaysExpenses.forEach((e) => {
        sumOfExpenses += e.amount;
      });

      let sumOfIncome = 0;

      const calculatedCash = sumOfExpenses + sumOfIncome;
      const diff = r.amount - calculatedCash;

      return {
        createdAt: r.createdAt,
        reportedCash: r.amount,
        expenses: sumOfExpenses,
        income: sumOfIncome,
        calculatedCash,
        diff,
      };
    }

    const thisDaysExpenses = expenses.filter((e) => {
      return (
        e.createdAt > arr[i + 1].createdAt && // expenses after the last report
        e.createdAt < r.createdAt && // and before this report
        e.mode == "CASH"
      );
    });
    let sumOfExpenses = 0;
    thisDaysExpenses.forEach((e) => {
      sumOfExpenses += e.amount;
    });

    let thisDaysIncome = transactions.filter((t) => {
      return (
        t.createdAt > arr[i + 1].createdAt && // transactions after the last report
        t.createdAt < r.createdAt && // and before this report
        t.mode == "CASH"
      );
    });
    let sumOfIncome = 0;
    thisDaysIncome.forEach((e) => {
      sumOfIncome += e.netPayable;
    });

    const calculatedCash = arr[i + 1].amount - sumOfExpenses + sumOfIncome;
    const diff = r.amount - calculatedCash;

    return {
      createdAt: r.createdAt,
      reportedCash: r.amount,
      expenses: sumOfExpenses,
      income: sumOfIncome,
      calculatedCash,
      diff,
    };
  });
  // } catch (e) {
  //   return []
  // }
}
