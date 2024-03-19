import { NextRequest, NextResponse } from "next/server";
import {
  format,
  subMonths,
  endOfMonth,
  startOfMonth,
  lastDayOfDecade,
} from "date-fns";
import { currentUtcDate } from "@/lib/currentUtcDate";
import { prisma } from "@/db/db";

// GET the stock count at the last date of previous month
// FIX THIS FUCKING ROUTE

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") as string;
  console.log("FROM LMAO : ", new Date(from));
  const myDate = currentUtcDate();
  // count
  const count = await prisma.dailyStockQuantity.groupBy({
    by: ["productId"],

    where: {
      date: {
        lt: new Date(from),
      },
    },

    _max: {
      date: true,
    },
  });

  const latestRecordIds = count.map((record: any) => record.date);

  const productIds = count.map((record: any) => record.productId);
  const latestDates = count.map((record: any) => record._max.date);

  const whereConditions = count.map((record) => ({
    AND: [
      { productId: record.productId },
      { date: { equals: record?._max?.date?.toISOString() } }, // Use 'equals' filter for exact date match
    ],
  }));

  const latestRecordsForEachProduct = await prisma.dailyStockQuantity.findMany({
    where: {
      OR: whereConditions,
    },
  });

  const totalQuantity = latestRecordsForEachProduct.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  console.log("COUNT FOR THWE OPENING STOCK ", count);
  console.log("latestRecordsForEachProduct: ", latestRecordsForEachProduct);
  console.log("TOTAL QUANTITY: ", totalQuantity);
  return NextResponse.json(totalQuantity, { status: 200 });
}
