// ISSUE ITEM
import { prisma } from "@/db/db";
import { updateDailyStockQuntity } from "@/lib/updateDailyStockQuantity";
import { updateTotalStockCount } from "@/lib/updateTotalStockCount";
import { auth } from "@clerk/nextjs";
import { error } from "console";
import { isBefore } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

// MEANS UPDATE  QUANTITY
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
    issuedBy,
  } = request;

  try {
    // GET THE PODUCT BEING ISSUED
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) return new NextResponse("Product not found", { status: 404 });

    // if TRUE return not allowed
    if (isBefore(dateOfIssue, product?.createdAt)) {
      return new NextResponse("Can not issue before the addtion date", {
        status: 401,
      });
    }

    if (product.quantity == 0)
      return new NextResponse("Quantity out of stock", { status: 401 });

    if (product.quantity - issueQuantity < 0)
      return new NextResponse("Not Enough Stock", { status: 401 });

    if (linkTo == "garage") {
      jobCard = "garage";
    }

    let newQuantity = Math.max(0, product.quantity - issueQuantity);

    let operation = "subtract";

    // what if there is a record already present for the current date
    // and person issued product for previous date?
    const res = await prisma.$transaction(async (tx) => {
      // this one is independent
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
          issuedBy,
        },
      });

      let currentDate = dateOfIssue;
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
    console.log("ERROR: ", error);
    return new NextResponse("SOMETHIHG WENT WRONG", { status: 401 });
  }
}
