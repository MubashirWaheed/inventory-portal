import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } },
) {
  const { productId } = params;

  const parsedId = parseInt(productId);
  // get date from the url
  let from = req.nextUrl.searchParams.get("date") as string;
  // return the latest record before the specific date
  const openingQuantity = await prisma.dailyStockQuantity.findMany({
    where: {
      productId: parsedId,
      date: {
        lt: new Date(from),
      },
    },
    take: 1,
  });
  console.log("openingQuantity in BACKEND-------------", openingQuantity);

  return NextResponse.json(openingQuantity, { status: 200 });
}
