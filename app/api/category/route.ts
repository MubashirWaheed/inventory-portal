import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/db/db";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) return NextResponse.json("Unauthorized", { status: 401 });

  const { category } = await req.json();

  // const data = await prisma.category.create({
  //   data: {
  //     name: category,
  //   },
  // });
  return NextResponse.json("good");
}
