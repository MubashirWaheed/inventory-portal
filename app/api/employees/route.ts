import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // basically this route will add the employees in the database
  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { employeeName } = await req.json();

  const dbValue = formatToDBValue(employeeName);

  const displayValue = formatToDisplayValue(employeeName);

  try {
    const res = await prisma.employee.create({
      data: {
        displayName: displayValue,
        value: dbValue,
      },
    });

    return NextResponse.json({ data: "employee created" }, { status: 201 });
  } catch (error) {
    console.log("ERROR: ", error);
    return new NextResponse("INTERNA ERROR", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const listOfEmployees = await prisma.employee.findMany({
      orderBy: {
        displayName: "asc",
      },
    });
    return NextResponse.json({ data: listOfEmployees });
  } catch (error) {
    console.log("ERROR GETTING EMPLOYEES: ", error);
    return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
  }
}

function formatToDBValue(employeeName: string) {
  return employeeName
    .trim()
    .split(" ")
    .filter((item: string) => item !== "")
    .map((item: string, index: number) => {
      if (index == 0) return item.toLowerCase();

      return (
        item.toLowerCase().charAt(0).toUpperCase() + item.slice(1).toLowerCase()
      );
    })
    .join("");
}

function formatToDisplayValue(employeeName: string) {
  return employeeName
    .split(" ")
    .filter((item: string) => item !== "")
    .map((item: string) => {
      return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
    })
    .join(" ");
}
