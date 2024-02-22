import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { employeeId: string } },
) {
  // get the id from the url
  const { employeeId } = params;

  // get the date range
  const from = req.nextUrl.searchParams.get("from") as string;
  const to = req.nextUrl.searchParams.get("to") as string;

  const data = await prisma.issueItem.findMany({
    where: {
      issuedAt: {
        lte: new Date(to),
        gte: new Date(from),
      },
      issuedToId: parseInt(employeeId),
    },
    include: {
      Product: {
        select: {
          itemCode: true,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });

  return NextResponse.json(data, { status: 200 });
}

export const revalidate = 0;
