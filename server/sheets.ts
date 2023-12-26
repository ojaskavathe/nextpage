import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

export const getSheetData = async () => {
  
  const doc = new GoogleSpreadsheet('19JIUXnHiYs2ExSQcyhthBTykHZquDmEG6oRt3DAeHMw', serviceAccountAuth);
  
  await doc.loadInfo(); // loads document properties and worksheets

  const sheet = doc.sheetsById[2092942290]
  const rows = await sheet.getRows({ limit: 10 })

  return rows.map((row) => row.toObject())
}

