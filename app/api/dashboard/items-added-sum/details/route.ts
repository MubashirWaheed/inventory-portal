import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // get the list of products that were added for the paricular time period

  const from = req.nextUrl.searchParams.get("from") as string;
  const to = req.nextUrl.searchParams.get("to") as string;
  // for the date and date for that date
  // get the items
  const data = await prisma.addStock.findMany({
    where: {
      addedAt: {
        lte: new Date(to),
        gte: new Date(from),
      },
    },
    include: {
      Product: {
        select: {
          itemCode: true,
        },
      },
    },
    orderBy: {
      addedAt: "desc",
    },
  });

  return NextResponse.json(data, { status: 200 });
}
