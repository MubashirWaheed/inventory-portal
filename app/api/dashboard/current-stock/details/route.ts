import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // get all the prdoucts
  const data = await prisma.product.findMany({
    // get all the products
    include: {
      Category: {
        select: {
          name: true,
        },
      },
    },
  });
  console.log("PRODUCTS  ", data);
  return NextResponse.json(data, { status: 200 });
}
