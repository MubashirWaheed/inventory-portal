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
  const { data } = useSWR(`/api/dashboard/current-stock/details`, fetcher);

  useEffect(() => {
    console.log("DATA : ", data);
  }, [data]);
  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">Current Stock </h2>
      </div>
      {/* Just fetch the details for the above time frame for now */}
      <div>
        <Table>
          <TableCaption>A list currnet items in inventory.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Index</TableHead>
              <TableHead className="">Product</TableHead>
              <TableHead className="">Quantity</TableHead>
              <TableHead className="">Company</TableHead>
              <TableHead className="">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data?.map((record: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{record.itemCode}</TableCell>
                    <TableCell className="">{record.quantity}</TableCell>
                    <TableCell className="">{record.company}</TableCell>
                    <TableCell className="">{record.Category.name}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
