"use server"

import { z } from "zod";

import { prisma } from "./db";

export const fetchTransactions = async () => {
  try {
    return await prisma.transaction.findMany({
      include: {
        patron: true
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
    return null;
  }
}