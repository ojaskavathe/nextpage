"use server";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { z } from "zod";
import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

if (!process.env.PATRON_DOC_ID || !process.env.CHECKOUT_DOC_ID) {
  process.exit(1);
}

const checkoutDoc = new GoogleSpreadsheet(
  process.env.CHECKOUT_DOC_ID,
  serviceAccountAuth,
);
const getCheckoutData = async () => {
  await checkoutDoc.loadInfo();
  const sheet = checkoutDoc.sheetsById[816875979];
  const rows = await sheet.getRows();
  return rows.map((row) => row.toObject());
};
const getCheckinData = async () => {
  await checkoutDoc.loadInfo();
  const sheet = checkoutDoc.sheetsById[398655784];
  const rows = await sheet.getRows();
  return rows.map((row) => row.toObject());
};
const getLendingData = async () => {
  await checkoutDoc.loadInfo();
  const sheet = checkoutDoc.sheetsById[1415617122];
  const rows = await sheet.getRows();
  return rows.map((row) => row.toObject());
};

export async function cronFetchLending() {
  const checkoutData = await getCheckoutData();
  const checkout = checkoutData.filter((row) => {
    const isId = z
      .string()
      .regex(/^M\d+$/)
      .safeParse(row["patron_id"]);
    return isId.success;
  });

  await prisma.subscription.updateMany({
    where: {
      patronId: {
        notIn: checkout.map((row: any) =>
          parseInt(row["patron_id"].substring(1)),
        ),
      },
    },
    data: {
      booksInHand: 0,
    },
  });

  checkout.forEach(async (row) => {
    try {
      await prisma.subscription.update({
        data: {
          booksInHand: parseInt(row["COUNTA of checked_out"]),
          lastIssued: row["MAX of checked_out"]
            ? new Date(row["MAX of checked_out"] + "T00:00:00.000+05:30")
            : null,
        },
        where: {
          patronId: parseInt(row["patron_id"].substring(1)),
        },
      });
    } catch (e) {
      console.log("Error inserting Checkout for " + row["patron_id"]);
    }
  });

  const checkinData = await getCheckinData();
  const checkin = checkinData.filter((row) => {
    const isId = z
      .string()
      .regex(/^M\d+$/)
      .safeParse(row["patron_id"]);
    return isId.success;
  });
  checkin.forEach(async (row) => {
    try {
      await prisma.subscription.update({
        data: {
          lastReturned: row["MAX of checked_in"]
            ? new Date(row["MAX of checked_in"] + "T00:00:00.000+05:30")
            : null,
        },
        where: {
          patronId: parseInt(row["patron_id"].substring(1)),
        },
      });
    } catch (e) {
      console.log("Error inserting Checkin for " + row["patron_id"]);
    }
  });

  await prisma.checkout.deleteMany();

  const lendingData = await getLendingData();

  const lending = lendingData
    .filter((row) => {
      const isId = z
        .string()
        .regex(/^M\d+$/)
        .safeParse(row["patron_id"]);
      return isId.success;
    })
    .map((row) => {
      return {
        patronId: parseInt(row["patron_id"].substring(1)),
        itemBarcode: row["item_barcode"] ? String(row["item_barcode"]) : "",
        title: row["title"],
        authors: row["creators"],
        checked_out: row["checked_out"]
          ? new Date(row["checked_out"] + "T00:00:00.000+05:30")
          : new Date(),
        checked_in: row["checked_in"]
          ? new Date(row["checked_in"] + "T00:00:00.000+05:30")
          : null,
      };
    });

  const legitPatronIds = await prisma.patron
    .findMany({
      where: {
        id: {
          in: lending.map((r) => r.patronId),
        },
      },
    })
    .then((p) => {
      return p.map((r) => r.id);
    });

  const filteredLending = lending.filter((r) =>
    legitPatronIds.includes(r.patronId),
  );

  await prisma.checkout.createMany({
    data: filteredLending.map((row) => {
      return {
        patronId: row.patronId,
        itemBarcode: row.itemBarcode,
        title: row.title,
        authors: row.authors,
        checked_out: row.checked_out,
        checked_in: row.checked_in,
      };
    }),
  });

  revalidatePath("/lending");
  revalidatePath("/patrons", "layout");
}
