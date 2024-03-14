"use client";
import { fetcher } from "@/lib/fetecher";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useDashboardTimeFrame from "@/hooks/useDashboardTimeFrame";

const OpeningStock = () => {
  const [date, setDate] = useState<Date>();

  const { date: defaultDate } = useDashboardTimeFrame();

  const { data } = useSWR(`/api/dailyStockQuantity?date=${date}`, fetcher);

  useEffect(() => {
    if (defaultDate && Object.keys(defaultDate).length !== 0) {
      setDate(defaultDate.from); // Set the default date obtained from useDashboardTimeFrame()
    }
  }, [defaultDate]);

  useEffect(() => {
    if (data) {
      console.log("DATA FOR THE OPENING MPONTH: ", data);
    }
  }, [data]);

  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">Opening Stock </h2>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) =>
                date > new Date() || date < new Date("2016-01-01")
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Table>
          <TableCaption>Items quantity at the start of month.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Index</TableHead>
              <TableHead className="">Product</TableHead>
              <TableHead className="">Opening Quantity</TableHead>
              <TableHead className="">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data?.map((record: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{record.Product.itemCode}</TableCell>
                    <TableCell className="">{record.quantity}</TableCell>
                    <TableCell className="">
                      {record.Product.Category.name}
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

export default OpeningStock;
