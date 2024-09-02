"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cronFetchLending } from "./lending";
import { cronRefreshFreeDD } from "./DD";

export const cronRefresh = async () => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_DATABASE_URL,
    log:
      process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  await cronFetchLending(prisma);
  await cronRefreshFreeDD(prisma);

  prisma.$disconnect();
  revalidatePath("/patrons", "layout");
};
