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

  const sumOfISsuedOvertime = await prisma.issueItem.aggregate({
    _sum: {
      issuedQuantity: true,
    },
    where: {
      productId: parsedId,
      issuedAt: {
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
  console.log("returnedItems._sum: ", returnedItems._sum);
  console.log("issuedQuantity._sum: ", sumOfISsuedOvertime._sum);
  const finalIssuedQuantity =
    //  @ts-ignore
    sumOfISsuedOvertime._sum.issuedQuantity -
    //  @ts-ignore
    returnedItems._sum.returnedQuantity;
  console.log("finalIssuedQuantity: ", finalIssuedQuantity);

  return NextResponse.json(finalIssuedQuantity, { status: 200 });
}
