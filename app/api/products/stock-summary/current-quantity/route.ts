import { prisma } from "@/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  // get the current list of products
  const currentQauntityList = await prisma.product.findMany();
  return NextResponse.json(currentQauntityList, { status: 200 });
}
