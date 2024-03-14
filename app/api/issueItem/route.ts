import { prisma } from "@/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  // Get sum of all the items issued for specifc time period
  try {
    const data = await prisma.issueItem.findMany({
      where: {},
    });
    return NextResponse.json("");
  } catch (error) {}
}
