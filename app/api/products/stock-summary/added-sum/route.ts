import { prisma } from "@/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  let products = await prisma.addStock.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      productId: "asc",
    },
  });
  const data = await prisma.product.findMany({
    where: {
      id: {
        in: products.map((record) => record.productId),
      },
    },
    select: {
      id: true,
      itemCode: true,
    },
  });

  const mergedData = data.map((product) => {
    const summary = products.find(
      (summary) => summary.productId === product.id,
    );
    if (summary) {
      return {
        id: product.id,
        itemCode: product.itemCode,
        quantity: summary._sum.quantity,
      };
    }
  });

  return NextResponse.json(mergedData, { status: 200 });
}

export const revalidate = 0;
