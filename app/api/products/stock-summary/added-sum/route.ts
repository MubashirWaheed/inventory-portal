import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") as string;
  const to = req.nextUrl.searchParams.get("to") as string;

  let products = await prisma.addStock.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    where: {
      addedAt: {
        gte: new Date(from),
        lt: new Date(to),
      },
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

    // include: {
    //   ReturnedItem: {
    //     where: {
    //       returnedDate: {
    //         gte: new Date(from),
    //         lte: new Date(to), //nd date of your date range
    //       },
    //     },
    //   },
    // },
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
