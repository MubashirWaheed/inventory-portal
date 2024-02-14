import { prisma } from "@/db/db";
import { subMonths } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { format } from "path";

import { auth } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import { addDays } from "date-fns";

export async function GET(req: NextRequest) {
  const currentDate = new Date();
  console.log("currentDate: ", currentDate);

  // Get the previous month's date
  const previousMonthDate = subMonths(currentDate, 1);
  console.log("previousMonthDate: ", previousMonthDate);

  // Quantity count based on the date range

  const issuedItemResult = await prisma.product.aggregate({
    _sum: {
      quantity: true,
    },
    where: {
      IssuedItem: {
        some: {
          issuedAt: {
            lte: currentDate,
          },
        },
      },
    },
  });

  const addStockResult = await prisma.product.aggregate({
    _sum: {
      quantity: true,
    },

    where: {
      AddStock: {
        some: {
          addedAt: {
            lte: currentDate,
          },
        },
      },
    },
  });

  const issuedItemQuantity = issuedItemResult._sum.quantity ?? 0;
  const addStockQuantity = addStockResult._sum.quantity ?? 0;
  console.log(
    "issuedItemQuantity: ",
    issuedItemQuantity,
    "addStockQuantity: ",
    addStockQuantity,
  );

  //   console.log("RESULT: ", result);
  //   return result._sum.quantity ?? 0;
  //   return NextResponse.json("good");

  return NextResponse.json("GOOD DATA");
}
