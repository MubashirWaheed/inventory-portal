import { prisma } from "@/db/db";
import { currentUtcDate } from "@/lib/currentUtcDate";
import { endOfMonth, subMonths } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const currentCountRecord = await prisma.totalStockCount.findMany({
    orderBy: {
      date: "desc",
    },
    take: 1,
  });

  // console.log("currentCountRecord: ", currentCountRecord);
  return NextResponse.json(currentCountRecord, { status: 200 });
}
