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
  checkoutData.forEach(async (row) => {
    const isId = await z
      .string()
      .regex(/^M\d+$/)
      .safeParseAsync(row["patron_id"]);
    if (isId.success) {
      try {
        await prisma.subscription.update({
          data: {
            booksInHand: parseInt(row["COUNTA of checked_out"]),
            lastIssued: row["MAX of checked_out"]
              ? new Date(row["MAX of checked_out"] + "T00:00:00.000Z")
              : null,
          },
          where: {
            patronId: parseInt(row["patron_id"].substring(1)),
          },
        });
      } catch (e) {
        console.log("Error inserting Checkout for " + row["patron_id"]);
      }
    }
  });

  const checkinData = await getCheckinData();
  checkinData.forEach(async (row) => {
    const isId = await z
      .string()
      .regex(/^M\d+$/)
      .safeParseAsync(row["patron_id"]);
    if (isId.success) {
      try {
        await prisma.subscription.update({
          data: {
            lastReturned: row["MAX of checked_in"]
              ? new Date(row["MAX of checked_in"] + "T00:00:00.000Z")
              : null,
          },
          where: {
            patronId: parseInt(row["patron_id"].substring(1)),
          },
        });
      } catch (e) {
        console.log("Error inserting Checkin for " + row["patron_id"]);
      }
    }
  });

  const lendingData = await getLendingData();
  await prisma.checkout.deleteMany();

  lendingData.forEach(async (row) => {
    const isId = await z
      .string()
      .regex(/^M\d+$/)
      .safeParseAsync(row["patron_id"]);
    if (isId.success) {
      try {
        await prisma.patron.update({
          data: {
            checkouts: {
              create: {
                itemBarcode: row["item_barcode"] ? row["item_barcode"] : 0,
                title: row["title"],
                authors: row["creators"],
                checked_out: row["checked_out"]
                  ? new Date(row["checked_out"] + "T00:00:00.000Z")
                  : new Date(),
                checked_in: row["checked_in"]
                  ? new Date(row["checked_in"] + "T00:00:00.000Z")
                  : null,
              },
            },
          },
          where: {
            id: parseInt(row["patron_id"].substring(1)),
          },
        });
      } catch (e) {
        console.log("Error inserting Lending for " + row["patron_id"]);
      }
    }
  });

  revalidatePath("/lending");
  revalidatePath("/patrons", "layout");

  return new Response("Lending Imported!");
}
