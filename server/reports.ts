"use server";

import { prisma } from "./db";

export const fetchPatrons = async () => {
  try {
    return await prisma.patron.findMany({
      include: {
        subscription: true,
        addons: true,
      },
      orderBy: {
        subscription: {
          expiryDate: "desc"
        },
      },
    });
  } catch (e) {
    return null;
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
        support: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (e) {
    return [];
  }
};

export const fetchCheckout = async (patronId: number) => {
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
};

export const fetchCheckouts = async () => {
  try {
    return await prisma.checkout.findMany({
      orderBy: {
        checked_out: "desc",
      },
      include: {
        patron: true,
      },
    });
  } catch (e) {
    return [];
  }
};
