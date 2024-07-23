import { cronRefreshFreeDD } from "@/server/cron/cron";
import { cronFetchLending } from "@/server/cron/lending";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authheader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authheader) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const auth = Buffer.from(authheader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const user = auth[0];
  const pass = auth[1];

  if (user != process.env.CRON_USER || pass != process.env.CRON_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await cronFetchLending();
  await cronRefreshFreeDD();

  return new NextResponse("Lending and DD Refreshed", { status: 200 });
}
