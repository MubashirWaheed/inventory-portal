"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DatePickerWithRange } from "@/components/ui/daterangepicker";

export default function Home() {
  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">Dashboard</h2>
        <DatePickerWithRange />
      </div>
      <div className="mt-4 flex flex-col md:flex-row justify-between gap-4">
        <Card className="bg-green-300 w-full">
          <CardHeader>
            <CardTitle>Total Skus</CardTitle>
          </CardHeader>
          <CardContent>
            <p>1200</p>
          </CardContent>
        </Card>
        <Card className="bg-red-300 w-full">
          <CardHeader>
            <CardTitle>Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p>4</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-300  w-full">
          <CardHeader>
            <CardTitle>Total Items Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <p>30</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-300 w-full">
          <CardHeader>
            <CardTitle>Skus Bought</CardTitle>
          </CardHeader>
          <CardContent>
            <p>50</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
