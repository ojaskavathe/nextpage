"use server";

import { T_SummaryCount } from "@/lib/utils";
import { prisma } from "./db";

export const fetchDailyCollection = async () => {
  try {
    const daily: T_SummaryCount[] = await prisma.$queryRaw`
      SELECT "createdAt"::date, sum("netPayable")
      FROM "Transaction"
      GROUP BY "createdAt"::date
      ORDER BY "createdAt"::date DESC`
    return daily;
  } catch (e) {
    return null;
  }
};

export const fetchMontlyCollection = async () => {
  try {
    const monthly: T_SummaryCount[] = await prisma.$queryRaw`
      SELECT date_trunc('month', "createdAt") as "createdAt", sum("netPayable")
      FROM "Transaction"
      GROUP BY date_trunc('month', "createdAt")
      ORDER BY date_trunc('month', "createdAt") DESC`
    return monthly;
  } catch (e) {
    return null;
  }
};

export const fetchYearlyCollection = async () => {
  try {
    const yearly: T_SummaryCount[] = await prisma.$queryRaw`
      SELECT date_trunc('year', "createdAt") as "createdAt", sum("netPayable")
      FROM "Transaction"
      GROUP BY date_trunc('year', "createdAt")
      ORDER BY date_trunc('year', "createdAt") DESC`
    return yearly;
  } catch (e) {
    return null;
  }
};
