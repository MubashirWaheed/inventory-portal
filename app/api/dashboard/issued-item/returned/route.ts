import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const jobCard = req.nextUrl.searchParams.get("jobCard") as string;
  const from = req.nextUrl.searchParams.get("from") as string;
  const to = req.nextUrl.searchParams.get("to") as string;

  const returnedItems = await prisma.returnedItem.findMany({
    where: {
      returnedDate: {
        gte: new Date(from),
        lte: new Date(to),
      },
      jobCard: jobCard,
    },
    orderBy: {
      returnedDate: "desc",
    },
  });
  return NextResponse.json(returnedItems, { status: 200 });
}
