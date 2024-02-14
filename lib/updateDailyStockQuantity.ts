import { prisma } from "@/db/db";

export async function updateDailyStockQuntity(
  currentDate: Date,
  productId: number,
  quantity: number,
  operation: string,
  tx: any,
) {
  // check if the record present for the day already
  const existingRecords = await tx.dailyStockQuantity.findMany({
    where: {
      id: productId,
    },
    take: 2,
  });

  const mostRecentRecord = existingRecords[0];

  if (existingRecords.length === 0) {
    // No existing records, create a new one
    await tx.dailyStockQuantity.create({
      data: {
        date: currentDate,
        quantity: quantity,
        productId,
      },
    });
    return; // Exit function
  }

  // Check if a new record is needed for the current date
  const isNewRecordNeeded =
    mostRecentRecord.date.toDateString() !== currentDate.toDateString();

  let updatedDailyStockQuntity = 0;
  if (operation === "add") {
    updatedDailyStockQuntity = mostRecentRecord.quantity + quantity;
  } else if (operation === "subtract") {
    updatedDailyStockQuntity = mostRecentRecord.quantity - quantity;
  }

  // If a new record is needed, create it; otherwise, update the existing record
  if (isNewRecordNeeded) {
    await tx.dailyStockQuantity.create({
      data: {
        date: currentDate,
        productId,
        quantity: updatedDailyStockQuntity,
      },
    });
  } else {
    await tx.dailyStockQuantity.update({
      where: {
        id: productId,
      },
      data: {
        quantity: updatedDailyStockQuntity,
      },
    });
  }
}
