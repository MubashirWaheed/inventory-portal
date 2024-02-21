"use client";
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
import useDashboardTimeFrame from "@/hooks/useDashboardTimeFrame";
import { fetcher } from "@/lib/fetecher";
import { format, parseISO } from "date-fns";
import { useEffect } from "react";
import useSWR from "swr";

export default function IssuedItems() {
  // get the timeframe for which to fecth the reacord

  const { data } = useSWR(`/api/dashboard/current-stock/details`, fetcher);

  useEffect(() => {
    console.log("DATA : ", data);
  }, [data]);
  // console.log(data);
  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">Current Stock </h2>
      </div>
      {/* Just fetch the details for the above time frame for now */}
      <div>
        <Table>
          <TableCaption>A list of your recent Issued Items.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Index</TableHead>
              <TableHead className="w-[100px]">Product</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Company</TableHead>
              <TableHead className="text-center">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data?.map((record: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index}</TableCell>
                    <TableCell>{record.itemCode}</TableCell>
                    <TableCell className="text-center"></TableCell>
                    <TableCell className="text-right">
                      {record.quantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.company}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.category}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
