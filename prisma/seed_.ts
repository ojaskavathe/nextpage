import { PrismaClient, $Enums } from "@prisma/client";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { z } from "zod";

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
const getTransactionData = async () => {
  await patronDoc.loadInfo();
  const sheet = patronDoc.sheetsById[1489557575];
  const rows = await sheet.getRows();
  return rows.map((row) => row.toObject());
};
const getLendingData = async () => {
  await patronDoc.loadInfo();
  const sheet = patronDoc.sheetsById[1319624793];
  const rows = await sheet.getRows();
  return rows.map((row) => row.toObject());
};

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

const prisma = new PrismaClient();

async function main() {
  const months = [1, 3, 6, 12];
  const dd = [0, 0, 2, 4];
  const hol = [0, 0, 1, 2];
  const dis = [0, 0.05, 0.1, 0.2];
  const patronData = await getPatronData();

  patronData.forEach(async (row) => {
    // based on duration
    const freeDD = parseInt(row["Free DD / Month"]);
    const freeHoliday = parseInt(row["Free Subsciption Holiday"]);

    const whatsapp = row["whats'app contact"] == "yes" ? true : false;

    const deposit_sr = row["SD with"] == "SR" ? true : false;

    try {
      await prisma.patron.create({
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
  });

  const transactionData = await getTransactionData();

  transactionData.forEach(async (row) => {
    try {
      await prisma.patron.update({
        where: {
          id: parseInt(row["Membership No"]),
        },
        data: {
          transactions: {
            create: {
              createdAt: new Date(row["Time"]),
              type: row["Transaction Type"],
              mode: row["Payment Mode"],
              netPayable: parseInt(row["Net Payable"]),
              oldPlan: row["Last Membership Plan"]
                ? parseInt(row["Last Membership Plan"])
                : null,
              newPlan: row["New Membership Plan"]
                ? parseInt(row["New Membership Plan"])
                : null,
              oldExpiry: row["Last Expiry Date"]
                ? new Date(row["Last Expiry Date"] + "T00:00:00.000Z")
                : null,
              newExpiry: row["New Expiry Date"]
                ? new Date(row["New Expiry Date"] + "T00:00:00.000Z")
                : null,
              readingFees: row["Reading Fees"]
                ? parseInt(row["Reading Fees"])
                : 0,
              deposit: row["Deposit"] ? parseInt(row["Deposit"]) : 0,
              registration: row["Registration Fees"]
                ? parseInt(row["Registration Fees"])
                : 0,
              DDFees: row["Door Delivery"] ? parseInt(row["Door Delivery"]) : 0,
              discount: row["Discount"] ? parseInt(row["Discount"]) : 0,
              pastDues: row["Past Due"] ? parseInt(row["Past Due"]) : 0,
              adjust: row["Adjusted Amount"]
                ? parseInt(row["Adjusted Amount"])
                : 0,
              reason: row["Reason for Adjustment"] || null,
              offer: row["Special Offer"] || null,
              attendedBy: row["Attended By"] || null,
              remarks: row["Remarks"] || null,
            },
          },
        },
      });
    } catch (e) {
      console.log("Error inserting Transaction for " + row["Membership No"]);
    }
  });

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
                itemBarcode: row["item_barcode"]
                  ? parseInt(row["item_barcode"])
                  : 0,
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

  try {
    await prisma.support.create({
      data: {
        id: "server",
        password: "password",
      },
    });
  } catch (e) {
    console.log("Error adding support!");
  }

  await prisma.$executeRaw`
    SELECT setval(pg_get_serial_sequence('"Patron"', 'id'), coalesce(max(id)+1, 1), false) FROM "Patron";
  `;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
