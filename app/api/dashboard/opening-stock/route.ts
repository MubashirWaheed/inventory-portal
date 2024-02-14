import { NextRequest, NextResponse } from "next/server";
import { format, subMonths, endOfMonth, startOfMonth } from "date-fns";
import { currentUtcDate } from "@/lib/currentUtcDate";
import { prisma } from "@/db/db";

// GET the stock count at the last date of previous month
export async function GET(req: NextRequest) {
  const currentDate = currentUtcDate();
  const lastDayOfPreviousMonth = endOfMonth(subMonths(currentDate, 1));
  lastDayOfPreviousMonth.setUTCHours(0, 0, 0, 0);

  const myDate = startOfMonth(currentDate);

  const record = await prisma.totalStockCount.findFirst({
    where: {
      date: {
        lt: myDate,
      },
    },
    take: 1,
  });

  // Check if the record exists
  if (!record) {
    return NextResponse.json("no record found", { status: 400 });
  }

  // console.log("record: ", record);
  return NextResponse.json(record, { status: 200 });
}