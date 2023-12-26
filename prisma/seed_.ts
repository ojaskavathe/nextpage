import { PrismaClient, $Enums } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

const getSheetData = async () => {
  const doc = new GoogleSpreadsheet('19JIUXnHiYs2ExSQcyhthBTykHZquDmEG6oRt3DAeHMw', serviceAccountAuth);
  
  await doc.loadInfo(); // loads document properties and worksheets

  const sheet = doc.sheetsById[2092942290];
  const rows = await sheet.getRows();

  return rows.map((row) => row.toObject());
}

const prisma = new PrismaClient();

async function main() {

  const months = [1, 3, 6, 12];
  const dd = [0, 0, 2, 4];
  const hol = [0, 0, 1, 2];
  const dis = [0, 0.05, 0.1, 0.2];
  const data = await getSheetData();

  data.forEach(async (row) => {
    // based on duration
    const freeDD = parseInt(row["Free DD / Month"]);
    const freeHoliday = parseInt(row["Free Subsciption Holiday"]);

    const whatsapp = (row["whats'app contact"] == 'yes') ? true : false;

    const deposit_sr = (row["SD with"] == 'SR') ? true : false;

    const createAccount = await prisma.patron.create({
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
          }
        },
      }
    })
  })

  await prisma.support.create({
    data: {
      id: 'server',
      password: 'password'
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })