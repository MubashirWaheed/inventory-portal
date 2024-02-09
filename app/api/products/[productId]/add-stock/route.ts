import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // now update the quantity
  const { productId, quantity: addedStock } = await req.json();

  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // simply create the addd to stock transaction here
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) return new NextResponse("Product not found", { status: 404 });

    const [test, stockItem] = await prisma.$transaction([
      prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          quantity: product?.quantity + addedStock,
        },
      }),

      prisma.addStock.create({
        data: {
          quantity: addedStock,
          productId,
        },
      }),
    ]);

    return NextResponse.json("added stock", { status: 201 });
  } catch (error) {
    return new NextResponse("error adding stock", { status: 401 });
  }
}
