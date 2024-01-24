"use client";

import { useClerk } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { DatePickerWithRange } from "@/components/ui/daterangepicker";

export default function Home() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-4">
          <DatePickerWithRange />
        </div>
      </div>
      <div className="mt-4 flex flex-col md:flex-row justify-between gap-4">
        <Card className=" w-full">
          <CardHeader>
            <CardTitle>Total Skus</CardTitle>
          </CardHeader>
          <CardContent>
            <p>1200</p>
          </CardContent>
        </Card>
        <Card className=" w-full">
          <CardHeader>
            <CardTitle>Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p>4</p>
          </CardContent>
        </Card>
        <Card className="  w-full">
          <CardHeader>
            <CardTitle>Total Items Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <p>30</p>
          </CardContent>
        </Card>
        <Card className=" w-full">
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
