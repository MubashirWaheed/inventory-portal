import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

// GET THE ISSUENANCE  DETAILS FOR THE PRODUCT
export async function GET(
  req: NextRequest,
  { params, query }: { params: { productId: string }; query: any },
) {
  let from = req.nextUrl.searchParams.get("from");
  let to = req.nextUrl.searchParams.get("to");

  let fromDate, toDate;
  if (from !== null && to !== null) {
    fromDate = new Date(from);
    toDate = new Date(to);
  }

  console.log("FROM:", from, "TO: ", to);

  const { productId } = params;

  console.log("productId: ", productId);

  const parsedProductId = parseInt(productId);

  const data = await prisma.issueItem.findMany({
    where: {
      productId: parsedProductId,
      issuedAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
    include: {
      Employee: true,
    },
  });

  // console.log("data: ", data);
  return NextResponse.json({ data });
}
