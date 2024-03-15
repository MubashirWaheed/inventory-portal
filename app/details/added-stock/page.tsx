"use client";
import useDashboardTimeFrameStore from "@/hooks/useDashboardTimeFrame";
import { fetcher } from "@/lib/fetecher";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";

import { DatePickerWithRange } from "@/components/ui/daterangepicker";

const AddedStock = () => {
  const { date, setDate } = useDashboardTimeFrameStore();

  const [flattenedData, setFlattenedData] = useState([]);

  const { data } = useSWR(
    `/api/dashboard/items-added-sum/details?from=${date.from}&to=${date.to}`,
    fetcher,
  );

  useEffect(() => {
    console.log("DATA For bought:", data);
    if (data && data.length > 0) {
      const newData = data.map((item: any) => {
        const { Product, ...rest } = item; // Destructure Product field and get rest of the fields
        return { ...rest, itemCode: Product.itemCode }; // Spread rest of the fields and add itemCode
      });
      setFlattenedData(newData); // Update state with flattened data
    }
  }, [data]);

  const fileName = "bought-details";
  return (
    <div className="px-8 pt-6 pb-8">
      <div className="pb-4 flex flex-col lg:flex-row justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">Added Quantity </h2>
        <div className="flex gap-4">
          <Button size="sm">
            <CSVLink filename={fileName} data={flattenedData}>
              Download Data
            </CSVLink>
          </Button>
          {
            // @ts-ignore
            <DatePickerWithRange date={date} setDate={setDate} />
          }
        </div>
      </div>
      <div>
        <Table>
          <TableCaption>A list of recently added Stock.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Index</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Product</TableHead>
              <TableHead className="text-center">Bought Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data?.map((record: any, index: number) => {
                const parsedDate = parseISO(record.addedAt);
                const formattedDate = format(parsedDate, "dd MMMM yyyy");
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{record.Product.itemCode}</TableCell>
                    <TableCell className="text-center">
                      {record.quantity}
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

export default AddedStock;
