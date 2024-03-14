import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from") as string;
  const to = req.nextUrl.searchParams.get("to") as string;

  const issuedItems = await prisma.issueItem.findMany({
    where: {
      issuedAt: {
        lte: new Date(to),
        gte: new Date(from),
      },
    },
    include: {
      Employee: {
        select: {
          displayName: true,
        },
      },
      Product: {
        select: {
          itemCode: true,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });

  const data2 = await Promise.all(
    issuedItems.map(async (issuedItem: any) => {
      const returnedItems = await prisma.returnedItem.findMany({
        where: {
          issueItemId: issuedItem.productId,
          jobCard: issuedItem.jobCard,
          returnedDate: {
            lte: new Date(to),
            gte: new Date(from),
          },
        },
      });

      return {
        ...issuedItem,
        ReturnedItem: returnedItems,
      };
    }),
  );
  console.log("DATA: ", data2);

  return NextResponse.json(data2, { status: 200 });
}
export const revalidate = 0;
