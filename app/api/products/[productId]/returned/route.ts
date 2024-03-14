import { prisma } from "@/db/db";
import { currentUtcDate } from "@/lib/currentUtcDate";
import { updateDailyStockQuntity } from "@/lib/updateDailyStockQuantity";
import { updateTotalStockCount } from "@/lib/updateTotalStockCount";
import { NextRequest, NextResponse } from "next/server";

// Make POST route
export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } },
) {
  const request = await req.json();
  const { productId } = params;
  // Extract values
  console.log("PRODUCT ID HERE: ", productId);
  console.log("REQUEST OBJECT: ", request);
  const { jobCard, quantity, returnedBy } = request;
  //link the item wit
  try {
    await prisma.$transaction(async (tx) => {
      await tx.returnedItem.create({
        data: {
          jobCard,
          returnedQuantity: quantity,
          returnedBy: returnedBy,
          returnedDate: currentUtcDate(),
          issueItemId: parseInt(productId),
          productId: parseInt(productId),
        },
      });

      // update the product quantity

      await tx.product.update({
        where: {
          id: parseInt(productId),
        },
        data: {
          quantity: {
            // Increment the quantity by the returned quantity
            increment: quantity,
          },
        },
      });

      // where the fuck do I get the product id
      await updateTotalStockCount(quantity, currentUtcDate(), "add", tx);
      await updateDailyStockQuntity(
        currentUtcDate(),
        parseInt(productId),
        quantity,
        "add",
        tx,
      );
    });

    return NextResponse.json("Goof", { status: 201 });
  } catch (error) {
    console.log(error);
  }
}
