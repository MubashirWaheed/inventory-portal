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

import { invoices } from "../constants/invoices";

const Product = () => {
  const itemsPerPage = 10; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  const totalInvoices = invoices.length;
  const totalPages = Math.ceil(totalInvoices / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = invoices.slice(startIndex, endIndex);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };
  return (
    <div className="px-8 pb-8 pt-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">MGL:300</h2>
        <DatePickerWithRange />
      </div>

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
              <TableHead>Car Number</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* invoices */}
            {currentInvoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="">{invoice.totalAmount}</TableCell>
                <TableCell className="text-left ml-4">
                  {invoice.quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
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
      </Pagination>
    </div>
  );
};

export default Product;
