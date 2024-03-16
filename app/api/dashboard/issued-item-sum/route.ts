import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") as string;
  const to = req.nextUrl.searchParams.get("to") as string;
  console.log("FRMO:", from);
  console.log("TO: ", to);

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
    // subtract the returned itsms valuess
  });

  const returnedItems = await prisma.returnedItem.aggregate({
    _sum: {
      returnedQuantity: true,
    },
    where: {
      returnedDate: {
        gte: new Date(from),
        lte: new Date(to),
      },
    },
  });

  console.log("RECORD: : ", record);

  let netIssuedQuantity = null;

  if (
    record &&
    record._sum &&
    record._sum.issuedQuantity !== null &&
    returnedItems &&
    returnedItems._sum &&
    returnedItems._sum.returnedQuantity !== null
  ) {
    netIssuedQuantity =
      record._sum.issuedQuantity - returnedItems._sum.returnedQuantity;
  } else if (
    record &&
    record._sum &&
    record._sum.issuedQuantity !== null &&
    (!returnedItems ||
      !returnedItems._sum ||
      returnedItems._sum.returnedQuantity === null)
  ) {
    // Handle the case where returned quantity is null
    netIssuedQuantity = record._sum.issuedQuantity;
  }
  console.log("nET ISSUED QUANTITY: ", netIssuedQuantity);
  return NextResponse.json({ netIssuedQuantity }, { status: 200 });
}
