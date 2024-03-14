import { NextRequest, NextResponse } from "next/server";
import { format, subMonths, endOfMonth, startOfMonth } from "date-fns";
import { currentUtcDate } from "@/lib/currentUtcDate";
import { prisma } from "@/db/db";

// GET the stock count at the last date of previous month
// FIX THIS FUCKING ROUTE

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") as string;
  console.log("FROM LMAO : ", new Date(from));
  const myDate = currentUtcDate();
  // count
  const count = await prisma.dailyStockQuantity.aggregate({
    where: {
      date: {
        lt: new Date(from),
      },
    },

    _sum: {
      quantity: true,
    },
  });

  console.log("COUNT FOR THWE OPENING STOCK ", count);
  return NextResponse.json(count, { status: 200 });
}
