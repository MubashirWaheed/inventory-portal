import { prisma } from "@/db/db";
import { subMonths } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const allProducts = await prisma.product.findMany();
  return NextResponse.json(allProducts, { status: 200 });
}

// export async function GET(req: NextRequest) {
//   const currentDate = new Date();

//   // Get the previous month's date
//   const previousMonthDate = subMonths(currentDate, 1);
//   console.log("previousMonthDate: ", previousMonthDate);

//   // Quantity count based on the date range

//   const issuedItemResult = await prisma.product.aggregate({
//     _sum: {
//       quantity: true,
//     },
//     where: {
//       IssuedItem: {
//         some: {
//           issuedAt: {
//             lte: currentDate,
//           },
//         },
//       },
//     },
//   });

//   const addStockResult = await prisma.product.aggregate({
//     _sum: {
//       quantity: true,
//     },

//     where: {
//       AddStock: {
//         some: {
//           addedAt: {
//             lte: currentDate,
//           },
//         },
//       },
//     },
//   });

//   const issuedItemQuantity = issuedItemResult._sum.quantity ?? 0;
//   const addStockQuantity = addStockResult._sum.quantity ?? 0;

//   return NextResponse.json("GOOD DATA");
// }
