import { prisma } from "@/server/db";
import { AsyncParser } from "@json2csv/node";

export async function GET(request: Request) {
  const parser = new AsyncParser();

  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    let csv = await parser.parse(transactions).promise();
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-disposition": 'attachment; filename="transactions.csv"',
      },
    });
  } catch (e) {
    return new Response();
  }
}
