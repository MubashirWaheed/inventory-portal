"use client";
import { DatePickerWithRange } from "@/components/ui/daterangepicker";
import CategoryDialog from "./components/CreateCategoryDialog";
import { format } from "date-fns";
import useSWR from "swr";
import { fetcher } from "@/lib/fetecher";
import CardSkeleton from "@/components/CardSkeleton";
import useDashboardTimeFrame from "@/hooks/useDashboardTimeFrame";

import DashboardCards from "./components/DashboardCards";

export default function Home() {
  const currentDate = new Date();
  const { date, setDate } = useDashboardTimeFrame();

  const currentMonth = format(currentDate, "MMMM");

  const { data, isLoading: openingLoading } = useSWR(
    "/api/dashboard/opening-stock",
    fetcher,
  );

  const { data: currentStockRecord, isLoading: currentLoading } = useSWR(
    "/api/dashboard/current-stock",
    fetcher,
  );

  const { data: addedStock, isLoading: itemAddedSumLoading } = useSWR(
    `/api/dashboard/items-added-sum?from=${date?.from}&to=${date?.to}`,
    fetcher,
  );

  const { data: issuedItem, isLoading: issuedItemLoading } = useSWR(
    `/api/dashboard/issued-item-sum?from=${date?.from}&to=${date?.to}`,
    fetcher,
  );

  const isLoading =
    issuedItemLoading ||
    itemAddedSumLoading ||
    currentLoading ||
    openingLoading;

  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">Dashboard</h2>
        <div className="flex justify-center flex-col sm:flex-row items-center gap-4">
          {
            // @ts-ignore
            <DatePickerWithRange date={date} setDate={setDate} />
          }
          <CategoryDialog />
        </div>
      </div>
      <div>
        {isLoading ? (
          <CardSkeleton />
        ) : (
          <DashboardCards
            addedStock={addedStock}
            data={data}
            currentStockRecord={currentStockRecord}
            issuedItem={issuedItem}
            currentMonth={currentMonth}
          />
        )}
      </div>
    </div>
  );
}
