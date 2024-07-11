"use server";

import { followupType } from "@/lib/utils";
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
          expiryDate: "desc",
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

export const fetchFollowup = async (
  type: followupType,
) => {
  const today = new Date();
  const monthAgo = new Date(new Date().setDate(today.getDate() - 30));
  const monthAhead = new Date(new Date().setDate(today.getDate() + 30));

  try {
    switch (type) {
      case "ACTIVE":
        return await prisma.patron.findMany({
          where: {
            subscription: {
              expiryDate: {
                gt: today,
              },
              lastIssued: {
                lt: monthAgo,
              },
            },
          },
          include: {
            subscription: true,
            addons: true,
          },
          orderBy: {
            subscription: {
              expiryDate: "desc",
            },
          },
        });
      case "GETTING":
        return await prisma.patron.findMany({
          where: {
            subscription: {
              expiryDate: {
                gt: today,
                lt: monthAhead,
              },
            },
          },
          include: {
            subscription: true,
            addons: true,
          },
          orderBy: {
            subscription: {
              expiryDate: "desc",
            },
          },
        });
      case "EXPIRED":
        return await prisma.patron.findMany({
          where: {
            subscription: {
              expiryDate: {
                gt: monthAgo,
                lt: today,
              },
            },
          },
          include: {
            subscription: true,
            addons: true,
          },
          orderBy: {
            subscription: {
              expiryDate: "desc",
            },
          },
        });
      case "DORMANT":
        return await prisma.patron.findMany({
          where: {
            subscription: {
              expiryDate: {
                lt: today,
              },
              booksInHand: {
                gt: 0,
              },
            },
          },
          include: {
            subscription: true,
            addons: true,
          },
          orderBy: {
            subscription: {
              expiryDate: "desc",
            },
          },
        });
      default:
        return [];
    }
  } catch (e) {
    return [];
  }
};
