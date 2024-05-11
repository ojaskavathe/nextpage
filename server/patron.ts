"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { $Enums, Patron } from "@prisma/client";

import {
  footfallFormSchema,
  patronCreateSchema,
  patronMiscAddonSchema,
  patronMiscClosureSchema,
  patronMiscDDSchema,
  patronMiscOtherSchema,
  patronMiscRefundSchema,
  patronRenewSchema,
  patronUpdateSchema,
} from "@/lib/schema";
import {
  addonFee,
  DDFees,
  discounts,
  durations,
  fee,
  freeDDs,
  holidays,
  refundableDeposit,
  registrationFees,
  sr_id,
} from "@/lib/utils";

import { prisma } from "./db";
import { currentStaff } from "./staff"

export const fetchPatron = async (patronId: number) => {
  const isId = await z.number().safeParseAsync(patronId);
  if (isId.success) {
    try {
      return await prisma.patron.findUnique({
        where: {
          id: patronId,
        },
        include: {
          subscription: true,
          transactions: {
            orderBy: {
              createdAt: "desc",
            },
          },
          addons: true,
        },
      });
    } catch (e) {
      return null;
    }
  }

  return null;
};

export const searchPatrons = async (searchString: string) => {
  const isId = await z
    .string()
    .regex(/^M\d+$/)
    .safeParseAsync(searchString);
  if (isId.success) {
    try {
      return await prisma.patron.findMany({
        where: {
          id: {
            equals: parseInt(searchString.substring(1)),
          },
        },
        include: {
          subscription: true,
          addons: true,
        },
        orderBy: [
          {
            subscription: {
              expiryDate: "desc",
            },
          },
        ],
        take: 5,
      });
    } catch (e) {
      return [];
    }
  }

  // if not an ID, check name and email
  const v = await z.string().min(1).safeParseAsync(searchString);
  if (v.success) {
    try {
      return await prisma.patron.findMany({
        where: {
          OR: [
            {
              name: {
                contains: searchString,
                mode: "insensitive", // case-insensitive
              },
            },
            {
              email: {
                contains: searchString,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          subscription: true,
          addons: true,
        },
        orderBy: [
          {
            subscription: {
              expiryDate: "desc",
            },
          },
        ],
        take: 5,
      });
    } catch (e) {
      return [];
    }
  }
  return [];
};

export async function createPatron(input: z.infer<typeof patronCreateSchema>) {
  let out: {
    data: Patron | null;
    error: number;
    message: string;
  };

  if (!patronCreateSchema.safeParse(input).success) {
    out = {
      data: null,
      error: 1,
      message: "Form couldn't be validated",
    };
    return out;
  }

  const staff = await currentStaff();

  const today = new Date();
  const exp = new Date(
    new Date(today).setMonth(today.getMonth() + input.duration),
  );

  const readingFee = fee[input.plan - 1] * input.duration;
  const DDFee = (input.paidDD || 0) * DDFees;

  const index = durations.indexOf(input.duration);
  const freeDD = freeDDs[index];
  const freeHoliday = holidays[index];
  const discount = readingFee * discounts[index];

  const total =
    readingFee +
    registrationFees +
    refundableDeposit -
    discount -
    (input.adjust || 0);

  try {
    const exists = await prisma.patron.findFirst({
      where: {
        OR: [
          {
            phone: input.phone,
          },
          {
            email: {
              equals: input.email,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (exists) {
      const which = exists.email === input.email ? "Email" : "Phone";

      return {
        data: null,
        error: 2,
        message: `${which} already exists!`,
      };
    }

    const newPatron = await prisma.patron.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        altPhone: input.altPhone,
        address: input.address,
        pincode: input.pincode,
        joiningDate: today,
        whatsapp: input.whatsapp,
        deposit: refundableDeposit,
        remarks: input.remarks,
        subscription: {
          create: {
            plan: input.plan,
            expiryDate: exp,
            monthlyDD: freeDD,
            freeDD: freeDD,
            paidDD: input.paidDD || 0,
            freeHoliday: freeHoliday,
            offer: input.offer,
          },
        },
        transactions: {
          create: [
            {
              type: $Enums.TransactionType.SIGNUP,
              mode: input.mode,

              registration: registrationFees,
              deposit: refundableDeposit,
              readingFees: readingFee,
              DDFees: DDFee,
              discount: discount,
              adjust: input.adjust || 0,
              reason: input.reason || null,
              offer: input.offer || null,
              remarks: input.remarks || null,

              netPayable: total,

              oldPlan: input.plan,
              newPlan: input.plan,
              oldExpiry: today,
              newExpiry: exp,

              support: {
                connect: {
                  id: staff.id,
                },
              },
            },
          ],
        },
      },
    });

    const [first, ...rest] = input.name.split(' ');
    const last = rest.length > 0 ? rest.join(' ') : 'SR';
    await fetch(
      "https://api.libib.com/patrons?" + new URLSearchParams({
        first_name: first,
        last_name: last,
        email: input.email,
        patron_id: sr_id( newPatron.id ),
        phone: input.phone,
        address1: input.address || '',
        city: 'Pune',
        country: 'IN',
        zip: input.pincode || '',
      }), {
        method: 'POST',
        headers: {
          'x-api-key': process.env.LIBIB_API_KEY || '',
          'x-api-user': process.env.LIBIB_API_USER || '',
        }
      }
    )

    revalidatePath(`/patrons/${newPatron.id}`);
    revalidatePath(`/patrons/search`);
    revalidatePath('/expenses/summary')

    return {
      data: newPatron,
      error: 0,
      message: "u gucci",
    };
  } catch (e) {
    return {
      data: null,
      error: 5,
      message: "[SERVER]: Something went wrong",
    };
  }
}

export async function renewPatron(
  input: z.infer<typeof patronRenewSchema>,
): Promise<{
  error: number;
  message: string;
}> {
  const validity = patronRenewSchema.safeParse(input);

  if (!validity.success) {
    return {
      error: 1,
      message: "Form couldn't be validated",
    };
  }

  const patron = await fetchPatron(input.id);
  if (!patron) {
    return {
      error: 2,
      message: "Patron doesn't exist",
    };
  }

  const oldPlan = patron.subscription!.plan;

  const today = new Date();
  const oldExpiry = patron.subscription!.expiryDate;

  let numDays = 0;
  const isPatronLate =
    patron.subscription!.booksInHand > 0 && oldExpiry < today;
  if (isPatronLate) {
    numDays = Math.floor(
      (today.valueOf() - oldExpiry.valueOf()) / (1000 * 60 * 60 * 24),
    );
  }

  const pastDues = input.renewFromExpiry
    ? 0
    : Math.floor((fee[input.plan - 1] * numDays) / 30);

  const newExpiry = isPatronLate
    ? input.renewFromExpiry
      ? new Date(
        new Date(oldExpiry).setMonth(oldExpiry.getMonth() + input.duration),
      )
      : new Date(today.setMonth(today.getMonth() + input.duration))
    : new Date(
      new Date(oldExpiry).setMonth(oldExpiry.getMonth() + input.duration),
    );

  const readingFee = fee[input.plan - 1] * input.duration;
  const DDFee = (input.paidDD || 0) * DDFees;

  const index = durations.indexOf(input.duration);
  const freeDD = freeDDs[index];
  const freeHoliday = holidays[index];
  const discount = readingFee * discounts[index];

  const total = readingFee + pastDues - discount - (input.adjust || 0);

  const totalPaidDDs = patron.subscription!.paidDD + (input.paidDD || 0);

  const support = await currentStaff();

  try {
    await prisma.patron.update({
      data: {
        subscription: {
          update: {
            plan: input.plan,
            expiryDate: newExpiry,
            monthlyDD: freeDD,
            freeDD: freeDD,
            paidDD: totalPaidDDs,
            freeHoliday: freeHoliday,
            offer: input.offer,
            closed: false,
          },
        },
        transactions: {
          create: [
            {
              type: $Enums.TransactionType.RENEWAL,
              mode: input.mode,

              readingFees: readingFee,
              DDFees: DDFee,
              discount: discount,
              pastDues: pastDues,
              adjust: input.adjust || 0,
              reason: input.reason || null,
              offer: input.offer || null,
              remarks: input.remarks || null,

              netPayable: total,

              oldPlan: oldPlan,
              newPlan: input.plan,
              oldExpiry: oldExpiry,
              newExpiry: newExpiry,

              supportId: support.id,
            },
          ],
        },
      },
      where: {
        id: input.id,
      },
    });

    revalidatePath(`/patrons/${patron.id}`, "layout");
    revalidatePath(`/patrons/search`);
    revalidatePath('/expenses/summary')

    return {
      error: 0,
      message: "u gucci",
    };
  } catch (e) {
    return {
      error: 5,
      message: "[SERVER]: Something went wrong",
    };
  }
}

export async function updatePatron(
  input: z.infer<typeof patronUpdateSchema>,
): Promise<{
  error: number;
  message: string;
}> {
  const validity = await patronUpdateSchema.safeParseAsync(input);

  if (!validity.success) {
    return {
      error: 1,
      message: "Failed to validate Patron Data.",
    };
  }

  const { id, ...props } = input;

  try {
    await prisma.patron.update({
      data: props,
      where: {
        id,
      },
    });

    const [first, ...rest] = input.name.split(' ');
    const last = rest.length > 0 ? rest.join(' ') : 'SR';
    await fetch(
      "https://api.libib.com/patrons?" + new URLSearchParams({
        first_name: first,
        last_name: last,
        email: input.email,
        phone: input.phone,
        address1: input.address || '',
        zip: input.pincode || '',
      }), {
        method: 'POST',
        headers: {
          'x-api-key': process.env.LIBIB_API_KEY || '',
          'x-api-user': process.env.LIBIB_API_USER || '',
        }
      }
    )
    revalidatePath(`/patrons/${id}`, "layout");
    revalidatePath(`/patrons/search`);

    return {
      error: 0,
      message: "u gucci",
    };
  } catch (e) {
    return {
      error: 5,
      message: "[SERVER]: Something went wrong",
    };
  }
}

export async function createFootfall(
  input: z.infer<typeof footfallFormSchema>,
) {
  if (!footfallFormSchema.safeParse(input).success) {
    return {
      error: 1,
      message: "Failed to validate Footfall Data.",
    };
  }

  const patron = await fetchPatron(input.id);
  if (!patron) {
    return {
      error: 2,
      message: "Patron doesn't exist",
    };
  }

  const currentFreeDD = patron.subscription!.freeDD;
  if (input.DDType == $Enums.DDType.FREE && currentFreeDD <= 0) {
    return {
      error: 3,
      message: "No Free DD Remaining",
    };
  }

  const newFreeDD =
    input.DDType == $Enums.DDType.FREE ? currentFreeDD - 1 : currentFreeDD;

  const currentPaidDD = patron.subscription!.paidDD;
  const newPaidDD =
    input.DDType == $Enums.DDType.PAID ? currentPaidDD - 1 : currentPaidDD;

  const support = await currentStaff();

  try {
    if (input.isDD) {
      await prisma.patron.update({
        data: {
          subscription: {
            update: {
              freeDD: newFreeDD,
              paidDD: newPaidDD,
            },
          },
          footfall: {
            create: {
              type: input.type,
              offer: input.offer,
              remarks: input.remarks,
              isDD: true,
              delivery: {
                create: {
                  patronId: input.id,
                  type: input.DDType,
                  numBooks: input.numBooks,
                  scheduledFor: input.scheduledDate,
                  message: input.message,
                },
              },
              support: {
                connect: {
                  id: support.id
                }
              },
              createdAt: input.scheduledDate,
            },
          },
        },
        where: {
          id: input.id,
        },
        include: {
          subscription: true,
        },
      });

      revalidatePath(`/patrons/${patron.id}`, "layout");
      revalidatePath(`/patrons/search`);

      return {
        error: 0,
        message: "u gucci",
      };
    } else {
      await prisma.footfall.create({
        data: {
          patron: {
            connect: {
              id: patron.id
            }
          },
          type: input.type,
          offer: input.offer,
          remarks: input.remarks,
          isDD: false,
          support: {
            connect: {
              id: support.id
            }
          },
        },
      });

      revalidatePath(`/patrons/${patron.id}`);
      revalidatePath(`/patrons/search`);

      return {
        error: 0,
        message: "u gucci",
      };
    }
  } catch (e) {
    return {
      error: 5,
      message: `[SERVER]: There was an error inserting footfall for user: ${sr_id(input.id)}`,
    };
  }
}

export async function miscDD(
  input: z.infer<typeof patronMiscDDSchema>,
): Promise<{
  error: number;
  message: string;
}> {
  if (!patronMiscDDSchema.safeParse(input).success) {
    return {
      error: 1,
      message: "Failed to validate Footfall Data.",
    };
  }

  const patron = await fetchPatron(input.id);
  if (!patron) {
    return {
      error: 2,
      message: "Patron doesn't exist",
    };
  }

  const support = await currentStaff();

  try {
    await prisma.patron.update({
      data: {
        subscription: {
          update: {
            paidDD: patron.subscription!.paidDD + (input.numDD || 0),
          },
        },
        transactions: {
          create: {
            mode: input.mode,
            type: "DD",
            DDFees: (input.numDD || 0) * DDFees,
            netPayable: (input.numDD || 0) * DDFees + (input.adjust || 0),

            oldPlan: patron.subscription!.plan,
            newPlan: patron.subscription!.plan,
            oldExpiry: patron.subscription!.expiryDate,
            newExpiry: patron.subscription!.expiryDate,

            adjust: input.adjust || 0,
            reason: input.reason,
            offer: input.offer,
            remarks: input.remarks,

            supportId: support.id,
          },
        },
      },
      where: {
        id: input.id,
      },
    });

    revalidatePath(`/patrons/${input.id}`, "layout");
    revalidatePath('/expenses/summary')

    return {
      error: 0,
      message: "u gucci",
    };
  } catch (e) {
    return {
      error: 5,
      message: "[SERVER]: Something went wrong",
    };
  }
}

export async function miscRefund(
  input: z.infer<typeof patronMiscRefundSchema>,
) {
  if (!patronMiscRefundSchema.safeParse(input).success) {
    return {
      error: 1,
      message: "Failed to validate Refund Data.",
    };
  }

  const patron = await fetchPatron(input.id);
  if (!patron) {
    return {
      error: 2,
      message: "Patron doesn't exist",
    };
  }

  const support = await currentStaff();

  try {
    await prisma.patron.update({
      data: {
        deposit: 0,
        transactions: {
          create: {
            mode: input.mode,
            type: "REFUND",
            netPayable: -patron.deposit + (input.adjust || 0),

            oldPlan: patron.subscription!.plan,
            newPlan: patron.subscription!.plan,
            oldExpiry: patron.subscription!.expiryDate,
            newExpiry: patron.subscription!.expiryDate,

            adjust: input.adjust || 0,
            reason: input.reason,
            offer: input.offer,
            remarks: input.remarks,

            supportId: support.id,
          },
        },
      },
      where: {
        id: input.id,
      },
    });

    revalidatePath(`/patrons/${input.id}`, "layout");
    revalidatePath('/expenses/summary')

    return {
      error: 0,
      message: "u gucci",
    };
  } catch (e) {
    return {
      error: 5,
      message: "[SERVER]: Something went wrong",
    };
  }
}

export async function miscClosure(
  input: z.infer<typeof patronMiscClosureSchema>,
) {
  if (!patronMiscClosureSchema.safeParse(input).success) {
    return {
      error: 1,
      message: "Failed to validate Closure Data.",
    };
  }

  const patron = await fetchPatron(input.id);
  if (!patron) {
    return {
      error: 2,
      message: "Patron doesn't exist",
    };
  }

  const support = await currentStaff();

  const netPayable =
    (input.adjust || 0) - (input.depositRefund ? patron.deposit : 0);

  try {
    await prisma.patron.update({
      data: {
        deposit: input.depositRefund ? 0 : patron.deposit,
        subscription: {
          update: {
            closed: true,
          },
        },
        transactions: {
          create: {
            mode: input.mode,
            type: "CLOSURE",
            netPayable: netPayable,

            oldPlan: patron.subscription!.plan,
            newPlan: patron.subscription!.plan,
            oldExpiry: patron.subscription!.expiryDate,
            newExpiry: patron.subscription!.expiryDate,

            adjust: input.adjust || 0,
            reason: input.reason,
            offer: input.offer,
            remarks: input.remarks,

            supportId: support.id,
          },
        },
      },
      where: {
        id: input.id,
      },
    });

    revalidatePath(`/patrons/${input.id}`, "layout");
    revalidatePath('/expenses/summary')

    return {
      error: 0,
      message: "u gucci",
    };
  } catch (e) {
    return {
      error: 5,
      message: "[SERVER]: Something went wrong",
    };
  }
}

export async function patronAddon(
  input: z.infer<typeof patronMiscAddonSchema>,
): Promise<{
  error: number;
  message: string;
}> {
  if (!patronMiscAddonSchema.safeParse(input).success) {
    return {
      error: 1,
      message: "Failed to validate Addon Data.",
    };
  }

  const patron = await fetchPatron(input.id);
  if (!patron) {
    return {
      error: 2,
      message: "Patron doesn't exist",
    };
  }

  const today = new Date();
  const planExpiry = patron.subscription!.expiryDate;
  const isPlanValid = planExpiry > today;
  if (!isPlanValid) {
    return {
      error: 3,
      message: "Patron subscription has expired",
    };
  }

  const addonExpiry = input.tillExpiry
    ? patron.subscription!.expiryDate
    : new Date(new Date().setMonth(today.getMonth() + input.duration!));

  const isAddonValid = addonExpiry <= planExpiry;
  if (!isAddonValid) {
    return {
      error: 4,
      message: "Addon duration too long",
    };
  }

  let numDays = 0;
  numDays = Math.floor(
    (addonExpiry.valueOf() - today.valueOf()) / (1000 * 60 * 60 * 24),
  );

  const addonFees = Math.ceil(
    input.tillExpiry
      ? (numDays * addonFee * input.plan) / 30
      : input.duration! * addonFee * input.plan,
  );

  const support = await currentStaff();

  try {
    await prisma.patron.update({
      data: {
        addons: {
          create: {
            plan: input.plan,
            expiryDate: addonExpiry,
          },
        },
        transactions: {
          create: {
            mode: input.mode,
            type: "ADDON",
            netPayable: addonFees + (input.adjust || 0),

            adjust: input.adjust || 0,
            reason: input.reason,
            offer: input.offer,
            remarks: input.remarks,

            oldPlan: patron.subscription!.plan,
            newPlan: patron.subscription!.plan,
            oldExpiry: patron.subscription!.expiryDate,
            newExpiry: patron.subscription!.expiryDate,

            supportId: support.id,
          },
        },
      },
      where: {
        id: input.id,
      },
    });

    revalidatePath(`/patrons/${input.id}`, "layout");
    revalidatePath('/expenses/summary')

    return {
      error: 0,
      message: "u gucci",
    };
  } catch (e) {
    return {
      error: 5,
      message: "[SERVER]: Something went wrong",
    };
  }
}

export async function miscOther(
  input: z.infer<typeof patronMiscOtherSchema>,
) {
  if (!patronMiscOtherSchema.safeParse(input).success) {
    return {
      error: 1,
      message: "Failed to validate Data.",
    };
  }

  const patron = await fetchPatron(input.id);
  if (!patron) {
    return {
      error: 2,
      message: "Patron doesn't exist",
    };
  }

  const support = await currentStaff();

  const total = ( input.amount || 0 ) + ( input.adjust || 0 );

  try {
    await prisma.patron.update({
      data: {
        transactions: {
          create: {
            mode: input.mode,
            type: "OTHER",
            netPayable: total,

            oldPlan: patron.subscription!.plan,
            newPlan: patron.subscription!.plan,
            oldExpiry: patron.subscription!.expiryDate,
            newExpiry: patron.subscription!.expiryDate,

            adjust: input.adjust || 0,
            reason: input.reason,
            offer: input.offer,
            remarks: input.remarks,

            supportId: support.id,
          },
        },
      },
      where: {
        id: input.id,
      },
    });

    revalidatePath(`/patrons/${input.id}`, "layout");
    revalidatePath('/expenses/summary')

    return {
      error: 0,
      message: "u gucci",
    };
  } catch (e) {
    return {
      error: 5,
      message: "[SERVER]: Something went wrong",
    };
  }
}
