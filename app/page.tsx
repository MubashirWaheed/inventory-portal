"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/daterangepicker";
import CategoryDialog from "./components/CreateCategoryDialog";

export default function Home() {
  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">Dashboard</h2>
        <div className="flex justify-center flex-col sm:flex-row items-center gap-4">
          <DatePickerWithRange />
          <CategoryDialog />
        </div>
      </div>

      {/* CARDS */}
      <div className="mt-4 w-full h-full grid sm:grid-cols-2  lg:grid-cols-4 gap-4 ">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Opening Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1230</div>
            <p className="text-sm text-muted-foreground">
              stock at the start of January
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Current Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1160</div>
            <p className="text-sm text-muted-foreground">
              Number of item in the inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Stock Bought
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">230</div>
            <p className="text-sm text-muted-foreground">
              in the month of January
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Items Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">130</div>
            <p className="text-sm text-muted-foreground">
              in the month of January
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
