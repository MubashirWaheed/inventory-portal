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

  const category = await prisma.category.findFirst({
    where: {
      id: parsedCategoryId,
    },
  });

  return NextResponse.json({ data: category });
}

// CRAETE PRODUCT FOR SPECIFIC CATEGORY
export async function POST(
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { itemCode, company, quantity, currentDate } = await req.json();

  const { categoryId } = params;
  const parsedCategoryId = parseInt(categoryId);

  const parsedQuantity = parseInt(quantity, 10);
  try {
    // ADD PRODUCT
    const product = await prisma.product.create({
      data: {
        createdAt: new Date(),
        itemCode,
        company,
        quantity: parsedQuantity,
        categoryId: parsedCategoryId,
      },
    });

    // ADD QUANITY VALUE TO THE TOTAL QUANTITY
    const existingRecord = await prisma.totalStockCount.findFirst({
      where: {
        date: currentDate,
        // date: "2024-02-10T00:00:00.000Z",
      },
    });

    if (existingRecord) {
      await prisma.totalStockCount.update({
        where: {
          id: existingRecord.id,
        },
        data: {
          totalStockCount: existingRecord.totalStockCount + quantity,
        },
      });
    } else {
      // Insert a new record if no record exists for the given date
      await prisma.totalStockCount.create({
        data: {
          date: currentDate,
          totalStockCount: quantity,
        },
      });
    }

    return NextResponse.json("good");
  } catch (error) {
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
