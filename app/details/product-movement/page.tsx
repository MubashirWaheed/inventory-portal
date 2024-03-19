"use client";
import { DatePickerWithRange } from "@/components/ui/daterangepicker";
import React, { useEffect, useState } from "react";
import useDashboardTimeFrame from "@/hooks/useDashboardTimeFrame";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { fetcher } from "@/lib/fetecher";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProductMovement = () => {
  const { date, setDate } = useDashboardTimeFrame();
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState("");
  const { data: listOfProducts } = useSWR("/api/products", fetcher);

  // Make necessary api requests here
  const { data: openingQuantityForProduct } = useSWR(
    value ? `/api/products/${value}/openingQuantity?date=${date.from}` : null,
    fetcher,
  );

  const { data: issuedSum } = useSWR(
    value
      ? `/api/products/${value}/issued-sum?from=${date.from}&&to=${date.to}`
      : null,
    fetcher,
  );
  const { data: boughtSum } = useSWR(
    value
      ? `/api/products/${value}/bought-sum?from=${date.from}&&to=${date.to}`
      : null,
    fetcher,
  );

  useEffect(() => {
    if (openingQuantityForProduct) {
      listOfProducts?.find((record: any) => {
        if (record.id === value) {
          console.log("RECORD OF CAR WASH: ", record);
        }
      })?.quantity || "0";
      console.log("Product selected: ", value);
      console.log("openingQuantityForProduct: ", openingQuantityForProduct);
      console.log("boughtSum:", boughtSum);
      console.log("issedSum: ", issuedSum);
    }
  }, [openingQuantityForProduct, boughtSum, issuedSum]);

  const handleSelect = async (productId: any) => {
    setOpen(false);
    setValue(productId == value ? "" : productId);
  };

  return (
    <div className="px-8 pt-6 pb-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <h2 className=" font-bold text-3xl tracking-tight">Product Movement</h2>
        {
          // @ts-ignore
          <DatePickerWithRange date={date} setDate={setDate} />
        }
      </div>

      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? listOfProducts?.find((record: any) => record.id === value)
                    ?.itemCode || "Select Product"
                : "Select Product"}

              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search Product..." />
              <CommandEmpty>No Product Found.</CommandEmpty>
              <CommandGroup>
                {listOfProducts?.map((product: any, index: number) => (
                  <CommandItem
                    key={index}
                    value={product.id}
                    onSelect={() => handleSelect(product.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === product.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {product.itemCode}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Table>
          <TableCaption>A list currnet items in inventory.</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="">Product</TableHead>
              <TableHead className="">Opening Quantity</TableHead>
              <TableHead className="">Bought Quantity</TableHead>
              <TableHead className="">Issued Quantity</TableHead>
              <TableHead>Current Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {openingQuantityForProduct !== undefined &&
              issuedSum !== undefined &&
              boughtSum !== undefined && (
                <TableRow>
                  {/* show product name  */}
                  <TableCell>
                    {value
                      ? listOfProducts?.find(
                          (record: any) => record.id === value,
                        )?.itemCode || "Unknown"
                      : "Select Product"}
                  </TableCell>
                  <TableCell className="">
                    {openingQuantityForProduct[0]?.quantity || 0}
                  </TableCell>
                  <TableCell className="">{boughtSum}</TableCell>
                  <TableCell className="">{issuedSum}</TableCell>
                  <TableCell>
                    {value
                      ? listOfProducts?.find(
                          (record: any) => record.id === value,
                        )?.quantity || "0"
                      : "Select Product"}
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductMovement;
