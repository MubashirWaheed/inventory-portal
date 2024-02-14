import { prisma } from "@/db/db";

// Function to update total stock count
export async function updateTotalStockCount(
  quantity: number,
  currentDate: Date,
  operation: string,
  tx: any,
) {
  const existingRecords = await tx.totalStockCount.findMany({
    orderBy: {
      date: "desc",
    },
    take: 2,
  });

  const mostRecentRecord = existingRecords[0];

  if (existingRecords.length === 0) {
    // No existing records, create a new one
    await tx.totalStockCount.create({
      data: {
        date: currentDate,
        totalStockCount: quantity,
      },
    });
    return; // Exit function
  }

  const isNewRecordNeeded =
    mostRecentRecord.date.toDateString() !== currentDate.toDateString();

  let updatedTotalStockCount = 0;

  if (operation === "add") {
    updatedTotalStockCount = mostRecentRecord.totalStockCount + quantity;
  } else if (operation === "subtract") {
    updatedTotalStockCount = mostRecentRecord.totalStockCount - quantity;
  }

  if (isNewRecordNeeded) {
    await tx.totalStockCount.create({
      data: {
        date: currentDate,
        totalStockCount: updatedTotalStockCount,
      },
    });
  } else {
    await tx.totalStockCount.update({
      where: {
        id: mostRecentRecord.id,
      },
      data: {
        date: currentDate,
        totalStockCount: updatedTotalStockCount,
      },
    });
  }
}
