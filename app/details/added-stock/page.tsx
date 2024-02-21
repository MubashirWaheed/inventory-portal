"use client";
import useDashboardTimeFrameStore from "@/hooks/useDashboardTimeFrame";
import { fetcher } from "@/lib/fetecher";
import React from "react";
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

// make api request
const AddedStock = () => {
  const { date } = useDashboardTimeFrameStore();

  const { data } = useSWR(
    `/api/dashboard/items-added-sum/details?from=${date.from}&to=${date.to}`,
    fetcher,
  );
  console.log("data: ", data);

  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">Added Quantity </h2>
      </div>
      {/* Just fetch the details for the above time frame for now */}
      <div>
        <Table>
          <TableCaption>A list of your recent Issued Items.</TableCaption>
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
                    <TableCell className="font-medium">{index}</TableCell>
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
