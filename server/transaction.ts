import { z } from "zod";
import { prisma } from "./db";

export const fetchTransaction = async (patronId: number) => {
  const isId = await z.number().safeParseAsync(patronId);
  if (isId.success) {
    try {
      return await prisma.transaction.findUnique({
        where: {
          id: patronId
        },
        include: {
          patron: true,
          support: true,
        }
      });
    } catch (e) {
      return null;
    }
  }

  return null;
}
