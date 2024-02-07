import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

// GET THE ISSUENANCE  DETAILS FOR THE PRODUCT
export async function GET(
  req: NextRequest,
  { params, query }: { params: { productId: string }; query: any },
) {
  let from = req.nextUrl.searchParams.get("from");
  let to = req.nextUrl.searchParams.get("to");

  console.log("FROM:", from, "TO: ", to);

  const { productId } = params;

  console.log("productId: ", productId);

  const parsedProductId = parseInt(productId);

  const data = await prisma.issueItem.findMany({
    where: {
      productId: parsedProductId,
    },
    orderBy: {
      issuedAt: "desc",
    },
  });

  // console.log("data: ", data);
  return NextResponse.json({ data });
}
