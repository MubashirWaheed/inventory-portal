"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/daterangepicker";
import CategoryDialog from "./components/CreateCategoryDialog";
import { format, getMonth, startOfMonth } from "date-fns";
import useSWR from "swr";
import { fetcher } from "@/lib/fetecher";
import Link from "next/link";
import CardSkeleton from "@/components/CardSkeleton";
import useDashboardTimeFrame from "@/hooks/useDashboardTimeFrame";
// import DashboardCards from 'first'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardCards from "./components/DashboardCards";
import SearchPerson from "./components/SearchPerson";
import SearchJobCard from "./components/SearchJobCard";
import { useEffect } from "react";

export default function Home() {
  // Hook that fetches the opening closing month stock
  const currentDate = new Date();
  const { date, setDate } = useDashboardTimeFrame();
  console.log("CURRENT DATE FRO THE SELECT: ", date);

  const currentMonth = format(currentDate, "MMMM");

  console.log("DATE IN TEH FRONTEND", date);

  const { data } = useSWR("/api/dashboard/opening-stock", fetcher);
  console.log("data: ", data);

  const { data: currentStockRecord } = useSWR(
    "/api/dashboard/current-stock",
    fetcher,
  );

  const { data: addedStock } = useSWR(
    `/api/dashboard/items-added-sum?from=${date?.from}&to=${date?.to}`,
    fetcher,
  );

  const { data: issuedItem } = useSWR(
    `/api/dashboard/issued-item-sum?from=${date?.from}&to=${date?.to}`,
    fetcher,
  );

  console.log(
    "data, currentStockRecord, addedStock, issuedItem: ",
    data,
    currentStockRecord,
    addedStock,
    issuedItem,
  );
  // const isLoading =
  //   !data ||
  //   !currentStockRecord ||
  //   !addedStock ||
  //   !issuedItem ||
  //   // dataError ||
  //   // currentStockError ||
  //   // addedStockError ||
  //   // issuedItemError;

  console.log("issuedItem: ", issuedItem);
  console.log("addedStock: ", addedStock);

  console.log(data);
  console.log("currentStockRecord: ", currentStockRecord);

  useEffect(() => {
    console.log("addedStock: ", addedStock);
  }, [addedStock]);
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
        {/* Tab */}
        <Tabs className="mt-2" defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="searchJobCard">Search JobCard</TabsTrigger>
            <TabsTrigger value="searchPerson">Search Person</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            {/* {isLoading ? (
              <CardSkeleton />
            ) : ( */}
            <DashboardCards
              addedStock={addedStock}
              data={data}
              currentStockRecord={currentStockRecord}
              issuedItem={issuedItem}
              currentMonth={currentMonth}
            />
            {/* )} */}
          </TabsContent>
          <TabsContent value="searchJobCard">
            <SearchJobCard />
          </TabsContent>
          <TabsContent value="searchPerson">
            <SearchPerson />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
