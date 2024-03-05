import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  try {
    const listOfSuppliers = await prisma.supplier.findMany();
    return NextResponse.json(listOfSuppliers, { status: 200 });
  } catch (error) {
    console.log("ERROR getting list of employers :", error);
    return new NextResponse("ERROR GETTING supplierss", { status: 401 });
  }
}

// adding supplier to the db
export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const request = await req.json();
  const { supplierName } = request.values;

  let supplierValue = formatName(supplierName);

  try {
    await prisma.supplier.create({
      data: {
        name: supplierName,
        value: supplierValue,
      },
    });
    return NextResponse.json("Supplier added Successfully", { status: 201 });
  } catch (error) {
    console.log("ERROR adding supplier: ", error);
  }
  return NextResponse.json("good", { status: 200 });
}

function formatName(value: string) {
  return value.split(" ").join("").toLowerCase();
}
