"use client";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { prisma } from "@/server/db";

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

if (!process.env.PATRON_DOC_ID || !process.env.CHECKOUT_DOC_ID) {
  process.exit(1);
}
const patronDoc = new GoogleSpreadsheet(
  process.env.PATRON_DOC_ID,
  serviceAccountAuth,
);
const getPatronData = async () => {
  await patronDoc.loadInfo(); // loads document properties and worksheets
  const sheet = patronDoc.sheetsById[2092942290];
  const rows = await sheet.getRows();
  return rows.map((row) => row.toObject());
};

//do nothing
export async function DummyComponent({ data }: { data: any }) {
  const patronData = await getPatronData();
  const row = patronData[1];
  // based on duration
  const freeDD = parseInt(row["Free DD / Month"]);
  const freeHoliday = parseInt(row["Free Subsciption Holiday"]);

  const whatsapp = row["whats'app contact"] == "yes" ? true : false;

  const deposit_sr = row["SD with"] == "SR" ? true : false;

  try {
    prisma.patron.create({
      data: {
        id: parseInt(row["Membership Number"]),
        name: row["Name"],
        email: row["Email"],
        phone: row["Mobile"],
        altPhone: row["Alternate Number"] || undefined,
        address: row["Address"] || undefined,
        joiningDate: new Date(row["Joining Date"] + "T00:00:00.000Z"),
        whatsapp,
        deposit: parseInt(row["Security Deposit"]),
        deposit_sr,
        pincode: row["Pincode"] || undefined,
        remarks: row["Additional Remarks"] || undefined,
        subscription: {
          create: {
            plan: parseInt(row["Plan"]),
            expiryDate: new Date(row["Expiry Date"] + "T00:00:00.000Z"),
            freeDD: freeDD,
            freeHoliday: freeHoliday,
          },
        },
      },
    });
  } catch (e) {
    console.log("Error inserting Patron: " + row["Membership Number"]);
  }

  return <></>;
}
