// ISSUE ITEM
import { prisma } from "@/db/db";
import { currentUtcDate } from "@/lib/currentUtcDate";
import { updateDailyStockQuntity } from "@/lib/updateDailyStockQuantity";
import { updateTotalStockCount } from "@/lib/updateTotalStockCount";
import { auth } from "@clerk/nextjs";
import { Console } from "console";
import { NextRequest, NextResponse } from "next/server";

// MEANS UPDATE UPDATE QUANTITY
export async function POST(req: NextRequest) {
  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const request = await req.json();

  let {
    quantity: issueQuantity,
    id,
    jobCard,
    issuedTo,
    linkTo,
    dateOfIssue,
  } = request;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) return new NextResponse("Product not found", { status: 404 });

    if (product.quantity == 0)
      return new NextResponse("Quantity out of stock", { status: 401 });

    if (product.quantity - issueQuantity < 0)
      return new NextResponse("Not Enough Stock", { status: 401 });

    if (linkTo == "garage") {
      jobCard = "garage";
    }

    let newQuantity = Math.max(0, product.quantity - issueQuantity);

    const currentDate = currentUtcDate();
    let operation = "subtract";

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: {
          id,
        },
        data: {
          quantity: newQuantity,
        },
      });

      await tx.issueItem.create({
        data: {
          productId: id,
          issuedToId: parseInt(issuedTo),
          issuedQuantity: issueQuantity,
          issuedAt: dateOfIssue,
          jobCard,
        },
      });

      await updateTotalStockCount(issueQuantity, currentDate, operation, tx);
      await updateDailyStockQuntity(
        currentDate,
        id,
        issueQuantity,
        operation,
        tx,
      );
    });

    return NextResponse.json("Issued item successfully", { status: 201 });
  } catch (error) {
    return new NextResponse("Error issuing item", { status: 401 });
  }
}
