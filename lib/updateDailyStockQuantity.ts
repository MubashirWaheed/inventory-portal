import { prisma } from "@/db/db";
import { isEqual, isSameDay } from "date-fns";
import { IsEqual } from "react-hook-form";

export async function updateDailyStockQuntity(
  currentDate: Date,
  productId: number,
  quantity: number,
  operation: string,
  tx: any,
) {
  // check if the record present for the day already
  // takeing the latest and bsing quantity on that(wrong)
  const existingRecords = await tx.dailyStockQuantity.findMany({
    where: {
      productId: productId,
      // date: {
      //   lte: currentDate,
      // },
    },
    orderBy: {
      date: "desc",
    },
    take: 1,
  });

  const mostRecentRecord = existingRecords[0];
  console.log("existingRecords: ", existingRecords);
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

  const isNewRecordNeeded = !isSameDay(currentDate, mostRecentRecord.date);
  console.log("isNewRecordNeeded: ", isNewRecordNeeded);
  console.log("CURRNET DATE:", currentDate);
  console.log("mostRecentRecord.date: ", mostRecentRecord.date);

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
        id: mostRecentRecord.id,
      },
      data: {
        quantity: updatedDailyStockQuntity,
      },
    });
  }
}
