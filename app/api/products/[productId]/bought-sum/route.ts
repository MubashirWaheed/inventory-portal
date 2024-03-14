import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } },
) {
  const { productId } = params;
  const parsedId = parseInt(productId);

  let from = req.nextUrl.searchParams.get("from") as string;
  let to = req.nextUrl.searchParams.get("to") as string;

  const sumOFAddedOverTime = await prisma.addStock.aggregate({
    _sum: {
      quantity: true,
    },
    where: {
      productId: parsedId,
      addedAt: {
        gte: new Date(from),
        lt: new Date(to),
      },
    },
  });

  const returnedItems = await prisma.returnedItem.aggregate({
    _sum: {
      returnedQuantity: true,
    },
    where: {
      productId: parsedId,
      returnedDate: {
        gte: new Date(from),
        lte: new Date(to),
      },
    },
  });
  //  @ts-ignore
  const finalAddedItemQuantity =
    //   @ts-ignore
    sumOFAddedOverTime._sum.quantity + returnedItems._sum.returnedQuantity;

  return NextResponse.json(finalAddedItemQuantity, { status: 200 });
}
