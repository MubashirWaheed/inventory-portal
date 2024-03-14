import { prisma } from "@/db/db";

import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  // summ of all the items issued
  const products = await prisma.issueItem.groupBy({
    by: ["productId"],
    _sum: {
      issuedQuantity: true,
    },
    orderBy: {
      productId: "asc",
    },
  });

  console.log("PRDOUCTS GROUPED: ", products);
  const data = await prisma.product.findMany({
    where: {
      id: {
        in: products.map((record) => record.productId),
      },
    },
    include: {
      ReturnedItem: true,
    },
  });

  const productsWithReturnSum = data.map((product) => {
    // Calculate the sum of return items quantity for the current product
    const returnItemsQuantitySum = product.ReturnedItem.reduce(
      (sum, item) => sum + item.returnedQuantity,
      0,
    );

    // Return the product along with the sum of return items quantity
    return {
      ...product,
      returnItemsQuantitySum,
    };
  });

  const mergedData = productsWithReturnSum.map((product) => {
    const summary = products.find(
      (summary) => summary.productId === product.id,
    );

    let quantity = 0;
    if (summary) {
      // If summary exists, check if issuedQuantity is not null or undefined
      quantity = summary._sum?.issuedQuantity ?? 0;
    }

    // Calculate the final quantity
    const finalQuantity = Math.max(
      0,
      quantity - product.returnItemsQuantitySum,
    );
    if (summary) {
      return {
        id: product.id,
        itemCode: product.itemCode,
        quantity: finalQuantity,
      };
    }
  });

  // console.log("Merged Data: ", mergedData);
  // add returned items

  return NextResponse.json(mergedData, { status: 200 });
}
