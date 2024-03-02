"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetecher";
import useDashboardTimeFrameStore from "@/hooks/useDashboardTimeFrame";
import { DatePickerWithRange } from "@/components/ui/daterangepicker";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

const SearchPerson = () => {
  const { date, setDate } = useDashboardTimeFrameStore();
  const { data: listOfEmployees } = useSWR("/api/employees", fetcher);

  const [open, setOpen] = useState(false);

  const [value, setValue] = useState("");

  const { data: test2 } = useSWR(
    value
      ? `/api/dashboard/issued-item/${value}?from=${date?.from}&to=${date?.to}`
      : null,
    fetcher,
  );

  const handleSelect = async (employeeId: any) => {
    setOpen(false);
    setValue(employeeId == value ? "" : employeeId);
  };
  return (
    <div className="px-8 pt-6 pb-8">
      <div className="pb-6 flex flex-col lg:flex-row justify-between">
        <h2 className="font-bold text-3xl tracking-tight">Search for Person</h2>
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between  items-start md:items-center gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {value
                  ? listOfEmployees?.data?.find(
                      (record: any) => record.id === value,
                    )?.displayName || "Select Person"
                  : "Select Person"}

                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search Person..." />
                <CommandEmpty>No Person Found.</CommandEmpty>
                <CommandGroup>
                  {listOfEmployees?.data?.map((person: any, index: number) => (
                    <CommandItem
                      key={index}
                      value={person.id}
                      onSelect={() => handleSelect(person.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === person.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {person.displayName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {
            // @ts-ignore
            <DatePickerWithRange date={date} setDate={setDate} />
          }
        </div>

        <Table className="mt-4">
          <TableCaption>A list of your recent issuance.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="">Product</TableHead>
              <TableHead>Job Card</TableHead>
              <TableHead className="">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {test2?.map((record: any, index: number) => {
              const parsedDate = parseISO(record.issuedAt);
              const formattedDate = format(parsedDate, "dd MMMM yyyy");
              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell className="font-medium">
                    {record.Product.itemCode}
                  </TableCell>
                  <TableCell>{record.jobCard}</TableCell>
                  <TableCell>{record.issuedQuantity}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SearchPerson;
