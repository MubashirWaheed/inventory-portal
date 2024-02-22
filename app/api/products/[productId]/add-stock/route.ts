import { prisma } from "@/db/db";
import { currentUtcDate } from "@/lib/currentUtcDate";
import { updateDailyStockQuntity } from "@/lib/updateDailyStockQuantity";
import { updateTotalStockCount } from "@/lib/updateTotalStockCount";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } },
) {
  const { productId } = params;

  const parsedId = parseInt(productId);

  const { quantity: addedStock } = await req.json();

  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // simply create the addd to stock transaction here
    const product = await prisma.product.findUnique({
      where: {
        id: parsedId,
      },
    });

    if (!product) return new NextResponse("Product not found", { status: 404 });

    const currentDate = currentUtcDate();

    let operation = "add";

    let newQuantity = product.quantity + addedStock;

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: {
          id: parsedId,
        },
        data: {
          quantity: newQuantity,
        },
      });

      // Create Added Stock Product Transaction
      // check if record presnet for that day then update that instead of creating new one
      await tx.addStock.create({
        data: {
          addedAt: currentDate,
          quantity: addedStock,
          productId: parsedId,
        },
      });

      await updateTotalStockCount(addedStock, currentDate, operation, tx);

      await updateDailyStockQuntity(
        currentDate,
        parsedId,
        addedStock,
        operation,
        tx,
      );
    });

    return NextResponse.json("added stock", { status: 201 });
  } catch (error) {
    console.log("ERROR:", error);
    return new NextResponse("error adding stock", { status: 401 });
  }
}
