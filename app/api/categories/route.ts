import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/db/db";
import { Prisma } from "@prisma/client";
import { formateCategory } from "@/lib/categoryFormatter";

// GET ALL CATEGORIES
export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.log("ERROR WHILE GETTING CATEGORIES:", error);
    return new NextResponse("ERROR FETCHING CATEGORIES", { status: 500 });
  }
}

// CREATE CATEGORY
export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { category } = await req.json();
  const formattedCategory = formateCategory(category);
  console.log("formattedCategory: ", formattedCategory);

  try {
    const newCategory = await prisma.category.create({
      data: {
        name: formattedCategory,
        createdAt: new Date(),
      },
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    console.log("New Category error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002" && error.meta?.modelName === "Category") {
        return new NextResponse("Category name must be unique", {
          status: 400,
        });
      }
    }

    return new NextResponse("INTERNAL ERROR", { status: 500 });
  }
  return NextResponse.json("good");
}
