import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";

export const cronRefreshFreeDD = async () => {
  const today = new Date();

  const patrons = await prisma.patron.findMany({
    include: {
      subscription: true,
    },
  });

  patrons.forEach(async (patron) => {
    const expiryDate = patron.subscription!.expiryDate;
    if (
      !patron.subscription!.closed &&
      expiryDate.getDate() == today.getDate() // the day-of-month is the same as expiry
    ) {
      console.log("HEHEHEHEHEHEHE: " + patron.id);
      await prisma.subscription.update({
        data: {
          freeDD: patron.subscription!.monthlyDD,
        },
        where: {
          patronId: patron.id,
        },
      });
    }
  });

  revalidatePath("/patrons", "layout");
  return new Response("FreeDD Refreshed!");
};
