// ISSUE ITEM
import { prisma } from "@/db/db";
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

  console.log("ISSUED TO ", issuedTo);
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

    const [productUpdated, issueItem] = await prisma.$transaction([
      // UPDATING THE QUANTITY OF PRODUCT
      prisma.product.update({
        where: {
          id,
        },
        data: {
          quantity: newQuantity,
        },
      }),

      // CREATING ISSUE ROW
      prisma.issueItem.create({
        data: {
          productId: id,
          issuedToId: parseInt(issuedTo),
          issuedQuantity: issueQuantity,
          issuedAt: dateOfIssue,
          jobCard,
        },
      }),
    ]);

    return NextResponse.json("Issued item successfully", { status: 201 });
  } catch (error) {
    return new NextResponse("error adding stock", { status: 401 });
  }
}
