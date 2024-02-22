"use client";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
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
import useDashboardTimeFrameStore from "@/hooks/useDashboardTimeFrame";

const SearchJobCard = () => {
  const [searchValue, setSearchValue] = useState("");
  const debounceValue = useDebounce(searchValue);

  const { date } = useDashboardTimeFrameStore();

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
    <div className="flex flex-col">
      <Input
        className="w-64 mt-4"
        placeholder="enter job card number"
        onChange={handleInput}
      />

      <Table className="mt-4">
        <TableCaption>A list of your recent issuance.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Index</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Job Card</TableHead>
            <TableHead className="">Product</TableHead>
            <TableHead className="">Quantity</TableHead>
            <TableHead>Person</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {test?.map((record: any, index: number) => {
            const parsedDate = parseISO(record.issuedAt);
            const formattedDate = format(parsedDate, "dd MMMM yyyy");
            return (
              <TableRow key={index}>
                <TableCell>{index}</TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>{record.jobCard}</TableCell>
                <TableCell className="font-medium">
                  {record.Product.itemCode}
                </TableCell>
                <TableCell className="">{record.issuedQuantity}</TableCell>
                <TableCell>{record.Employee.displayName}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SearchJobCard;
