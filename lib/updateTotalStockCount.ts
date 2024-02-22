import { prisma } from "@/db/db";
import { error } from "console";
import { isBefore, isSameDay } from "date-fns";
import { NextResponse } from "next/server";

// Function to update total stock count
export async function updateTotalStockCount(
  quantity: number,
  currentDate: Date,
  operation: string,
  tx: any,
) {
  // GET THE LATEST record for the count
  const latestRecord = await tx.totalStockCount.findMany({
    orderBy: {
      date: "desc",
    },
    take: 1,
  });
  // if no record present than create one

  // in case no record present it should return after this if statement
  if (latestRecord.length == 0) {
    // create record
    const record = await tx.totalStockCount.create({
      data: {
        date: currentDate,
        totalStockCount: quantity,
      },
    });
    return;
  }

  // also using this function to add to the total stock count
  // check for that
  if (isBefore(currentDate, latestRecord[0].date) && operation == "subtract") {
    throw new Error("Can't issue before the last issue date");
  }
  console.log("latestRecord in the totalStockCount: : ", latestRecord);

  let newCount;
  if (operation == "add") {
    newCount = latestRecord[0].totalStockCount + quantity;
  } else if ("subtract") {
    newCount = latestRecord[0].totalStockCount - quantity;
  }

  // create new record in case no record present for todays date
  if (isSameDay(currentDate, latestRecord[0].date)) {
    const newRecord = await tx.totalStockCount.update({
      where: {
        id: latestRecord[0].id,
      },
      data: {
        totalStockCount: newCount,
      },
    });
  } else {
    const newRecord = await tx.totalStockCount.create({
      data: {
        date: currentDate,
        totalStockCount: newCount,
      },
    });
  }
}
