import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// UPDATE QUANTITY FOR PARTICULAR PRODUCT

export async function PUT(req: Request) {
  const request = await req.json();
  let { quantity, id, jobCard, issuedTo, linkTo, dateOfIssue, operation } =
    request;

  console.log("request: ", request);

  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  try {
    // FETCH THE PRODUCT QUANTITY
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    let updatedQuantity = product.quantity;

    // REFACTOR THIS GARBAGE CHUNK OF CODE
    if (quantity < 0) {
      if (product.quantity == 0) {
        return new NextResponse("Quantity out of stock", { status: 401 });
      } else if (product.quantity + quantity < 0) {
        return new NextResponse("not enough stock", { status: 401 });
      } else {
        updatedQuantity -= Math.abs(quantity);
      }
    } else {
      updatedQuantity += quantity;
    }

    // NOW CREATE THE ISSUE TRANSACTION
    if (linkTo == "garage") {
      jobCard = "garage";
    }

    if (operation == "ISSUE_STOCK") {
      const [productUpdated, issueItem] = await prisma.$transaction([
        prisma.product.update({
          where: {
            id,
          },
          data: {
            quantity: updatedQuantity,
          },
        }),

        prisma.issueItem.create({
          data: {
            productId: id,
            issuedTo,
            issuedQuantity: quantity,
            issuedAt: dateOfIssue,
            jobCard,
          },
        }),
      ]);
      return NextResponse.json("Issed item succesfully");
    } else if (operation == "ADD_STOCK") {
      try {
        const result = await prisma.product.update({
          where: {
            id,
          },
          data: {
            quantity: updatedQuantity,
          },
        });
        return NextResponse.json("added stock");
      } catch (error) {
        return new NextResponse("error adding stock", { status: 401 });
      }
    }
  } catch (error) {
    console.log("ERROR: ", error);
    return new NextResponse("error", { status: 500 });
  }
}
