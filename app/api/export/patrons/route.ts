import { prisma } from "@/server/db";
import { AsyncParser } from "@json2csv/node";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const parser = new AsyncParser();

  try {
    const patronData = await prisma.patron.findMany({
      include: {
        subscription: true,
      },
      orderBy: {
        subscription: {
          expiryDate: "desc",
        },
      },
    });

    const patron = patronData.map(({subscription, ...p}) => {
      if (!subscription) {
        return new Response();
      }
      const { id, patronId, ...sub } = subscription;
      return ({ ...p, ...sub });
    })

    let csv = await parser.parse(patron).promise();
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-disposition": 'attachment; filename="patrons.csv"',
      },
    });
  } catch (e) {
    return new Response();
  }
}
