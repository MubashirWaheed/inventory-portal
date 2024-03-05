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
  const { date } = useDashboardTimeFrame();
  console.log("DATE FROM PARENT: ", date);

  const { data } = useSWR(
    `/api/dashboard/issued-item-sum/details?to=${date?.to}&from=${date?.from}`,
    fetcher,
  );

  console.log("LMAO: ", data);
  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">Issued Items </h2>
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
              <TableHead className="text-center">Issued to</TableHead>
              <TableHead className="text-right">Job Card</TableHead>
              <TableHead className="text-center">IssuedQuantity</TableHead>
              <TableHead className="text-center">Issued By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data?.map((record: any, index: number) => {
                console.log("BLUD: ", record?.ReturnedItem);
                const returnedQuantity = record?.ReturnedItem?.reduce(
                  (total: number, item: any) => total + item.returnedQuantity,
                  0,
                );
                console.log("returned Quantity: ", returnedQuantity);

                const parsedDate = parseISO(record.issuedAt);
                const formattedDate = format(parsedDate, "dd MMMM yyyy");
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{record.Product.itemCode}</TableCell>
                    <TableCell className="text-center">
                      {record.Employee.displayName}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.jobCard}
                    </TableCell>
                    <TableCell className="text-center">
                      {/* subtracted the returned quantity */}
                      {record.issuedQuantity - returnedQuantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.issuedBy}
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
