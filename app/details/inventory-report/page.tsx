"use client";
import { CSVLink, CSVDownload } from "react-csv";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetcher } from "@/lib/fetecher";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import useDashboardTimeFrame from "@/hooks/useDashboardTimeFrame";
import { DatePickerWithRange } from "@/components/ui/daterangepicker";
import { mergeStockData } from "@/lib/mergeStockData";

const Inventoryreport = () => {
  const [myData, setMyData] = useState();
  const { date, setDate } = useDashboardTimeFrame();

  const { date: defaultDate } = useDashboardTimeFrame();

  const { data: currentQuantityOfProducts } = useSWR(
    "/api/products/stock-summary/current-quantity",
    fetcher,
  );

  const { data: openingQuantity } = useSWR(
    `/api/dailyStockQuantity?date=${defaultDate.from}`,
    fetcher,
  );
  // console.log("previous month", data);

  const { data: addedSumForProduct } = useSWR(
    `/api/products/stock-summary/added-sum?from=${date.from}&&to=${date.to}`,
    fetcher,
  );

  const { data: issuedSumForProduct } = useSWR(
    `/api/products/stock-summary/issued-sum?from=${date.from}&&to=${date.to}`,
    fetcher,
  );

  useEffect(() => {
    if (
      openingQuantity &&
      currentQuantityOfProducts &&
      addedSumForProduct &&
      issuedSumForProduct
    ) {
      const finalData = mergeStockData(
        openingQuantity,
        currentQuantityOfProducts,
        addedSumForProduct,
        issuedSumForProduct,
      );
      console.log("FINAL DATA", finalData);

      setMyData(finalData);
    }
  }, [
    openingQuantity,
    currentQuantityOfProducts,
    addedSumForProduct,
    issuedSumForProduct,
  ]);

  const fileName = "inventory-report";
  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <h2 className="font-bold text-3xl tracking-tight">Inventory Report </h2>
        {myData ? (
          <div className="flex gap-4">
            <Button size="sm">
              <CSVLink filename={fileName} data={myData}>
                Download Data
              </CSVLink>
            </Button>
            {
              // @ts-ignore
              <DatePickerWithRange date={date} setDate={setDate} />
            }
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>

      <div>
        <Table>
          {/* <TableCaption>A list of recently added Stock.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Index</TableHead>
              <TableHead className="w-[100px]">Product</TableHead>
              <TableHead className="text-center">Opening Quantity</TableHead>
              <TableHead className="text-center">Bought Quantity</TableHead>
              <TableHead className="text-center">Issued Quantity</TableHead>
              <TableHead className="text-center">Current Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myData &&
              // @ts-ignore
              myData?.map((record: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{record.itemCode}</TableCell>
                    <TableCell className="text-center">
                      {record.openingQuantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.addedQuantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.issuedQuantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.currentQuantity}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Inventoryreport;
