"use client";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { fetcher } from "@/lib/fetecher";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { DatePickerWithRange } from "@/components/ui/daterangepicker";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import useDashboardTimeFrameStore from "@/hooks/useDashboardTimeFrame";

const SearchJobCard = () => {
  const currentDate = new Date();
  const { date, setDate } = useDashboardTimeFrameStore();
  const [searchValue, setSearchValue] = useState("");
  const debounceValue = useDebounce(searchValue);

  const { data: test } = useSWR(
    debounceValue
      ? `/api/dashboard/issued-item/search-job-card?jobCard=${debounceValue}&to=${date?.to}&from=${date?.from}`
      : null,
    fetcher,
  );

  const handleInput = (e: any) => {
    setSearchValue(e.target.value);
  };
  useEffect(() => {
    console.log("debounceValue: ", debounceValue);
  }, [debounceValue]);
  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">
          Search for Jobcard
        </h2>
        <div className="flex justify-center flex-col sm:flex-row items-center gap-4"></div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Input
            className="w-64 mt-4"
            placeholder="enter job card number"
            onChange={handleInput}
          />
          {
            // @ts-ignore
            <DatePickerWithRange date={date} setDate={setDate} />
          }
        </div>

        <Table className="mt-4">
          <TableCaption>Items issued for specifc JobCard.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Job Card</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Person</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {test?.map((record: any, index: number) => {
              const parsedDate = parseISO(record.issuedAt);
              const formattedDate = format(parsedDate, "dd MMMM yyyy");
              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>{record.jobCard}</TableCell>
                  <TableCell className="font-medium">
                    {record.Product.itemCode}
                  </TableCell>
                  <TableCell>{record.issuedQuantity}</TableCell>
                  <TableCell>{record.Employee.displayName}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SearchJobCard;
