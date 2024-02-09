import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

// GET ALL THE PRODCUTS FOR PARTICULAR CATEGORY
export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  const { categoryId } = params;

  const parsedCategoryId = parseInt(categoryId);

  const products = await prisma.product.findMany({
    where: {
      categoryId: parsedCategoryId,
    },
  });

  return NextResponse.json({ data: products });
}

// CRAETE PRODUCT FOR SPECIFIC CATEGORY
export async function POST(
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { itemCode, company, quantity } = await req.json();

  const { categoryId } = params;
  const parsedCategoryId = parseInt(categoryId);
  console.log("parsedCategoryId: ", parsedCategoryId, typeof parsedCategoryId);

  const parsedQuantity = parseInt(quantity, 10);

  try {
    const product = await prisma.product.create({
      data: {
        itemCode,
        company,
        quantity: parsedQuantity,
        categoryId: parsedCategoryId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    // unique constraint failed
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2002" && error?.meta?.modelName == "Product") {
        return new NextResponse("Category name must be unique", {
          status: 400,
        });
      }
    }
    console.log("ERROR CREATING PRODUCT", error);
    return new NextResponse("ERROR FETCHING Products", { status: 500 });
  }
}

// UPDATE PRODUCT QUANTITY FOR
