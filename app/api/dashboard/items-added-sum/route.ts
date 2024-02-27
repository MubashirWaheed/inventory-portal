import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import { number } from "zod";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") as string;
  const to = req.nextUrl.searchParams.get("to") as string;

  const sumResult = await prisma.addStock.aggregate({
    _sum: {
      quantity: true,
    },
    where: {
      addedAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
    },
  });

  return NextResponse.json(sumResult, { status: 200 });
}
