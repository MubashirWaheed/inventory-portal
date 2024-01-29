import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/db/db";
import { Prisma } from "@prisma/client";
import { formateCategory } from "@/lib/categoryFormatter";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { category } = await req.json();
  const formattedCategory = formateCategory(category);

  try {
    const newCategory = await prisma.category.create({
      data: {
        name: formattedCategory,
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
}

export async function GET(req: Request) {
  // return all categories
  try {
    const categories = await prisma.category.findMany();

    console.log("categories from the DB", categories);
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.log("somehing went wrong:", error);
  }
}
