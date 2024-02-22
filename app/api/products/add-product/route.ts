import { prisma } from "@/db/db";
import { currentUtcDate } from "@/lib/currentUtcDate";
import { updateTotalStockCount } from "@/lib/updateTotalStockCount";
import { auth } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const currentDate = currentUtcDate();

  const categoryId = req.nextUrl.searchParams.get("categoryId") as string;

  const parsedCategoryId = parseInt(categoryId);

  const { itemCode, company, quantity } = await req.json();

  const parsedQuantity = parseInt(quantity);

  let operation = "add";

  try {
    // ADD PRODUCT
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          createdAt: currentDate,
          itemCode,
          company,
          quantity: parsedQuantity,
          categoryId: parsedCategoryId,
        },
      });

      await updateTotalStockCount(quantity, currentDate, operation, tx);

      // Create a record for the product's daily stock quantity at the particular date
      await tx.dailyStockQuantity.create({
        data: {
          date: currentDate,
          quantity: quantity,
          productId: product.id,
        },
      });
    });

    return NextResponse.json("good", { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2002" && error?.meta?.modelName == "Product") {
        return new NextResponse("Product name must be unique", {
          status: 400,
        });
      }
    }
    console.log("ERROR CREATING PRODUCT", error);
    return new NextResponse("ERROR FETCHING Products", { status: 500 });
  }
}
