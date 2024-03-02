"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

const DashboardCards = ({
  data,
  currentStockRecord,
  addedStock,
  issuedItem,
  currentMonth,
}: any) => {
  return (
    <div className="mt-4 w-full h-full grid sm:grid-cols-2  lg:grid-cols-4 gap-4 ">
      <Card className="transition-all ease-in-out  h-[150px] hover:cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Opening Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{data?.openingStock}</div>
          <p className="text-sm text-muted-foreground">
            stock at the start of {currentMonth}
          </p>
        </CardContent>
      </Card>
      <Link href="/details/current-stock">
        <Card className="h-[150px]  dark:hover:scale-[1.01] hover:drop-shadow-md drop-shadow-sm ease-in-out  transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Current Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {currentStockRecord && currentStockRecord?.length > 0
                ? currentStockRecord[0]?.totalStockCount
                : 0}
            </div>
            <p className="text-sm text-muted-foreground">
              number of items in the inventory
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/details/added-stock">
        <Card className="h-[150px] dark:hover:scale-[1.01] hover:drop-shadow-md drop-shadow-sm ease-in-out  transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Stock Bought
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {addedStock &&
              addedStock._sum &&
              addedStock._sum.quantity !== null
                ? addedStock._sum.quantity
                : 0}
            </div>
            <p className="text-sm text-muted-foreground">
              for the above time period
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/details/issued-items">
        <Card className="h-[150px] dark:hover:scale-[1.01] hover:drop-shadow-md drop-shadow-sm ease-in-out  transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Items Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {issuedItem &&
              issuedItem._sum &&
              issuedItem._sum.issuedQuantity !== null
                ? issuedItem._sum.issuedQuantity
                : 0}
              {/* {issuedItem?._sum?.issuedQuantity} */}
            </div>
            <p className="text-sm text-muted-foreground">
              {/* in the month of {currentMonth} */}
              for the above time period
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/details/search-jobcard">
        <Card className="h-[150px] dark:hover:scale-[1.01] hover:drop-shadow-md drop-shadow-sm ease-in-out transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Search Against JobCard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Number of items issued for specific Job Card
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/details/search-person">
        <Card className="h-[150px] dark:hover:scale-[1.01] hover:drop-shadow-md drop-shadow-sm ease-in-out  transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Search Against Person
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Number of items issued to specific Person
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default DashboardCards;
