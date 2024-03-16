import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import { firstDayOfPreviousMonth } from "@/lib/dateUtils";

// GET the month
export async function GET(req: NextRequest) {
  const firstDayOfPrevMonth = firstDayOfPreviousMonth();
  // read the the date sent in the url
  let from = req.nextUrl.searchParams.get("date") as string;
  console.log("FROM: ", from);

  try {
    const latestDates = await prisma.dailyStockQuantity.findMany({
      where: {
        date: {
          lt: new Date(from),
        },
      },
      distinct: ["productId"],
      orderBy: { date: "desc" },
      include: {
        Product: {
          select: {
            Category: {
              select: {
                name: true,
              },
            },
            itemCode: true,
          },
        },
      },
    });

    console.log("LATEST DATA:", latestDates);
    return NextResponse.json(latestDates, { status: 200 });
  } catch (error) {
    console.log("ERROR GETTING DAILY STOCK QUANTITY", error);
    return NextResponse.json("ERROR Getting daily quantity", { status: 401 });
  }
}
