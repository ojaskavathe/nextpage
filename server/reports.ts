"use server";

import { followupType, PatronWithSub } from "@/lib/utils";
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

export const fetchFollowup = async (type: followupType) => {
  const today = new Date();
  const monthAgo = new Date(new Date().setDate(today.getDate() - 30));
  const monthAhead = new Date(new Date().setDate(today.getDate() + 30));

  try {
    switch (type) {
      case "ACTIVE": {
        const data = await prisma.patron.findMany({
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
              expiryDate: "asc",
            },
          },
        });
        return data.map((d) => {
          return { ...d, type };
        });
      }
      case "GETTING": {
        const data = await prisma.patron.findMany({
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
        return data.map((d) => {
          return { ...d, type };
        });
      }
      case "EXPIRED": {
        const data = await prisma.patron.findMany({
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
        return data.map((d) => {
          return { ...d, type };
        });
      }
      case "DORMANT":
        const data = await prisma.patron.findMany({
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
        return data.map((d) => {
          return { ...d, type };
        });
      default: {
        const data: PatronWithSub[] = [];
        return data.map((d) => {
          return { ...d, type };
        });
      }
    }
  } catch (e) {
    const data: PatronWithSub[] = [];
    return data.map((d) => {
      return { ...d, type };
    });
  }
};
