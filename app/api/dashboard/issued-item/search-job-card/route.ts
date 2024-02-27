import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  //   { params }: { params: { jobCard: string } },
) {
  // get the id from the url
  //   const { jobCard } = params;
  // get the date range
  const jobCard = req.nextUrl.searchParams.get("jobCard") as string;
  const from = req.nextUrl.searchParams.get("from") as string;
  const to = req.nextUrl.searchParams.get("to") as string;

  const data = await prisma.issueItem.findMany({
    where: {
      issuedAt: {
        lte: new Date(to),
        gte: new Date(from),
      },
      jobCard: jobCard,
    },
    include: {
      Product: {
        select: {
          itemCode: true,
        },
      },
      Employee: {
        select: {
          displayName: true,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });
  return NextResponse.json(data, { status: 200 });
}
