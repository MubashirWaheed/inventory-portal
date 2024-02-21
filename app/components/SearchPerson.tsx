"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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

// make api request
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const SearchPerson = () => {
  const { data: listOfEmployees } = useSWR("/api/employees", fetcher);
  const { date } = useDashboardTimeFrameStore();

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
    <div className="mt-4">
      {/* DROPDOWN */}
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
                <TableCell>{index}</TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell className="font-medium">
                  {record.Product.itemCode}
                </TableCell>
                <TableCell>{record.jobCard}</TableCell>
                <TableCell className="">{record.issuedQuantity}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SearchPerson;
