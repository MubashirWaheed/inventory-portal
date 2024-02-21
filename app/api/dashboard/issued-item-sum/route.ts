import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") as string;
  const to = req.nextUrl.searchParams.get("to") as string;

  console.log("----------------------ISSUED-----------------------");
  console.log("from: ", from);
  console.log("to: ", to);

  const record = await prisma.issueItem.aggregate({
    _sum: {
      issuedQuantity: true,
    },
    where: {
      issuedAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
    },
  });
  console.log("HELO MF ISSUED:  ", record);
  return NextResponse.json(record, { status: 200 });
}
