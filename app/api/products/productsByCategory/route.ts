import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  let categoryId = req.nextUrl.searchParams.get("categoryId") as string;
  try {
    const parsedCategoryId = parseInt(categoryId);

    const products = await prisma.product.findMany({
      where: {
        categoryId: parsedCategoryId,
      },
      include: {
        Category: {
          select: {
            name: true,
          },
        },
      },
    });
    return NextResponse.json({ data: products });
  } catch (error) {
    console.log("error: ", error);
    return new NextResponse("Error");
  }
}

export const revalidate = 0;
