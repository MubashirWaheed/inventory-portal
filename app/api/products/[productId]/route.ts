import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// RETURN PRODUCT DETAILS
export async function GET(req: Request) {
  return NextResponse.json("good", { status: 200 });
}
