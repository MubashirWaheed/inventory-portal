"use client";
import { DatePickerWithRange } from "@/components/ui/daterangepicker";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// import { invoices } from "../constants/invoices";
import useSWR from "swr";
import { fetcher } from "@/lib/fetecher";
import { addDays, format, getMonth, startOfMonth } from "date-fns";
import { useParams } from "next/navigation";
import { DateRange } from "react-day-picker";

// Get all the issue data for the product and display in table
const Product = () => {
  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);
  const [date, setDate] = useState<DateRange | undefined>({
    from: firstDayOfMonth,
    to: new Date(),
  });

  const params = useParams();
  const { productId } = params;

  const { data } = useSWR(
    `/api/issueItem/${productId}?from=${date?.from}&to=${date?.to}`,
    fetcher,
  );

  console.log("data from the issueItem API ", data);

  return (
    <div className="px-8 pb-8 pt-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">MGL:300</h2>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      {/* CARD */}
      <Card className="mt-5 py-2">
        <CardHeader className="py-3">
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <div className="grid  py-3">
          <div className="grid grid-cols-4">
            <CardContent className="col-span-2  py-0">
              <p className="text-lg tracking-tight ">
                Initial inventory at the beginning of the month: 25
              </p>
            </CardContent>
            <CardContent className="py-0 col-span-2 ">
              <p>Current stock: 22</p>
            </CardContent>
          </div>
          <div className="grid grid-cols-4">
            <CardContent className="col-span-2  py-0">
              <p>Items Issued: 3</p>
            </CardContent>
            <CardContent className="py-0 col-span-2 ">
              <p>Purchases: 24</p>
            </CardContent>
          </div>
        </div>
      </Card>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Date</TableHead>
              <TableHead>Person</TableHead>
              <TableHead>Job Card</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((item: any, index: number) => {
              // convert date to local time
              const parsedDate = format(item.issuedAt, "do MMMM yyyy");

              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {parsedDate}
                    {/* <br /> */}
                    {/* {parsedTime} */}
                  </TableCell>
                  <TableCell>{item.Employee.displayName}</TableCell>
                  <TableCell>{item.jobCard}</TableCell>
                  <TableCell>{item.issuedQuantity}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* <Pagination>
        <PaginationContent>
          <PaginationPrevious
            href="#"
            onClick={() => handlePageChange(currentPage - 1)}
            // disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <PaginationLink
              key={index + 1}
              href="#"
              // active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          ))}
          <PaginationNext
            href="#"
            onClick={() => handlePageChange(currentPage + 1)}
            // disabled={currentPage === totalPages}
          />
        </PaginationContent>
      </Pagination> */}
    </div>
  );
};

export default Product;
