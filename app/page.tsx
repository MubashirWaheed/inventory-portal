"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/daterangepicker";
import CategoryDialog from "./components/CreateCategoryDialog";
import { startOfMonth } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import useSWR from "swr";
import { fetcher } from "@/lib/fetecher";

export default function Home() {
  // Hook that fetches the opening closing month stock
  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);

  const [date, setDate] = useState<DateRange | undefined>({
    from: firstDayOfMonth,
    to: new Date(),
  });

  // const lastMonthDate = new Date();
  // lastMonthDate.setUTCHours(0, 0, 0, 0);
  const { data } = useSWR("/api/dashboard/opening-stock", fetcher);
  console.log("data: ", data);

  const { data: currentStockRecord } = useSWR(
    "/api/dashboard/current-stock",
    fetcher,
  );

  const { data: addedStock } = useSWR(
    `/api/dashboard/items-added?from=${date?.from}&to=${date?.to}`,
    fetcher,
  );

  const { data: issuedItem } = useSWR(
    `/api/dashboard/issued-item?from=${date?.from}&to=${date?.to}`,
    fetcher,
  );
  console.log("issuedItem: ", issuedItem);
  console.log("addedStock: ", addedStock);
  console.log(data);
  console.log("currentStockRecord: ", currentStockRecord);

  // console.log("lastMonthDate: ", lastMonthDate);
  // const startOfMonthCount = "";
  // const { data: startOfMonthCount } = useSWR(
  //   `/api/dashboard/stock-count?date=${lastMonthDate}`,
  //   fetcher,
  // );
  // `/api/products?from=${date?.from}&to=${date?.to}`,
  // console.log("TEST: ", startOfMonthCount);

  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">Dashboard</h2>
        <div className="flex justify-center flex-col sm:flex-row items-center gap-4">
          <DatePickerWithRange date={date} setDate={setDate} />
          <CategoryDialog />
        </div>
      </div>

      {/* CARDS */}
      <div className="mt-4 w-full h-full grid sm:grid-cols-2  lg:grid-cols-4 gap-4 ">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Opening Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totalStockCount}</div>
            <p className="text-sm text-muted-foreground">
              stock at the start of January
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Current Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {currentStockRecord && currentStockRecord[0]?.totalStockCount}
            </div>
            <p className="text-sm text-muted-foreground">
              Number of item in the inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Stock Bought
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {addedStock?._sum?.quantity}
            </div>
            <p className="text-sm text-muted-foreground">
              in the month of January
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Items Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {issuedItem?._sum?.issuedQuantity}
            </div>
            <p className="text-sm text-muted-foreground">
              in the month of January
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
