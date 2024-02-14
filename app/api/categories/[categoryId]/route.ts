import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import { addDays } from "date-fns";
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

  const { itemCode, company, quantity, currentDate } = await req.json();

  const { categoryId } = params;
  const parsedCategoryId = parseInt(categoryId);
  console.log("parsedCategoryId: ", parsedCategoryId, typeof parsedCategoryId);

  const parsedQuantity = parseInt(quantity, 10);
  try {
    // ADD PRODUCT
    const product = await prisma.product.create({
      data: {
        itemCode,
        company,
        quantity: parsedQuantity,
        categoryId: parsedCategoryId,
      },
    });
    console.log(
      "--------------------------CURRENT DATE CURRENT DATE---------",
      currentDate,
    );

    // ADD QUANITY VALUE TO THE TOTAL QUANTITY
    const existingRecord = await prisma.totalStockCount.findFirst({
      where: {
        date: currentDate,
        // date: "2024-02-10T00:00:00.000Z",
      },
    });
    console.log(
      "------------------EXISTING RECORD VALUE: ",
      existingRecord,
      "------------------",
    );

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

    // NOW CREATE FOR THSI PARTICULAR PRODUCT
    // CHECK IF RECORD PRESNT FOR THE PARTICULAR DATE

    // const dailyRecord = await prisma.dailyStockQuantity.findFirst({
    //   where: {
    //     date: currentDate,
    //   },
    // });

    // if (dailyRecord) {
    //   await prisma.dailyStockQuantity.update({
    //     where: {
    //       id: dailyRecord.id,
    //     },
    //     data: {
    //       quantity: dailyRecord.quantity + quantity,
    //     },
    //   });
    // } else {
    //   await prisma.dailyStockQuantity.create({
    //     data: {
    //       productId: product.id,
    //       quantity,
    //       date: currentDate,
    //     },
    //   });
    // }

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

// UPDATE PRODUCT QUANTITY FOR
