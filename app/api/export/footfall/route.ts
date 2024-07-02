import { prisma } from "@/server/db";
import { AsyncParser } from "@json2csv/node";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const parser = new AsyncParser();

  try {
    const footfall = await prisma.footfall.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    let csv = await parser.parse(footfall).promise();
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-disposition": 'attachment; filename="footfall.csv"',
      },
    });
  } catch (e) {
    return new Response();
  }
}
