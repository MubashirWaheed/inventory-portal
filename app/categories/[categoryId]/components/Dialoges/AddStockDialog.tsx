import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Toaster } from "@/components/ui/sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { Calendar } from "@/components/ui/calendar";

type Product = {
  id: number;
  itemCode: string;
  company: string;
  quantity: number;
  categoryId: number;
};

const baseSchema = z.object({
  quantity: z.coerce.number().min(1).positive().int().max(1000),
});

const mySchema = z.discriminatedUnion("stockType", [
  z
    .object({
      stockType: z.literal("bought"),
      supplier: z.string().min(1, { message: "too small" }),
      invoiceNo: z.string().min(1, { message: "to small" }).trim(),
    })
    .merge(baseSchema),
  z
    .object({
      stockType: z.literal("returned"),
      jobCard: z.string().min(2).trim(),
      returnedBy: z.string().min(1),
    })
    .merge(baseSchema),
]);

const AddStockDialog = ({
  item,
  suppliersList,
  employeeList,
}: {
  item: Product;
  suppliersList: any;
  employeeList: any;
}) => {
  console.log("employeeList inside the form : ", employeeList);
  const { mutate } = useSWRConfig();
  const { itemCode, id: productId, categoryId, quantity } = item;

  const API_URL_RETURNED = `/api/products/${productId}/returned`;
  const API_URL_BOUGHT = `/api/products/${productId}/add-stock`;

  const [open, setOpen] = useState(false);

  const [supplierOpen, setSupplierOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(mySchema),
    defaultValues: {
      quantity: 0,
      stockType: "bought",
      supplier: "",
      invoiceNo: "",
      jobCard: "",
      returnedBy: "",
    },
  });

  const stockType = form.watch("stockType");
  const allValues = form.watch();

  useEffect(() => {
    console.log("allValues:", allValues);
  }, [allValues]);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof mySchema>) => {
    try {
      const apiUrl =
        values.stockType === "bought" ? API_URL_BOUGHT : API_URL_RETURNED;
      await axios.post(apiUrl, { ...values });

      mutate(`/api/categories/${categoryId}`);
      form.reset();
      toast.success("Restocked Successfully", {
        style: {
          fontSize: "16px",
        },
        className: "class",
      });
      setOpen(false);
      console.log("submitted");
    } catch (error) {
      console.log("ERROR in the frontend: ", error);
      toast.error("Error adding items to stock");
    }
  };

  const handleSelect = (supplier: any) => {
    setSupplierOpen(false);
    form.setValue("supplier", supplier.value);
  };

  const personSelect = (person: any) => {
    setPersonOpen(false);
    form.setValue("returnedBy", person.value);
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add Stock</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Name: <span className="text-green-500">{itemCode}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          {/* @ts-ignore */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="stockType"
              render={({ field }) => (
                <FormItem className="grid py-2 grid-cols-4 items-center">
                  <FormLabel className="col-span-1 text-center">
                    Stock Type
                  </FormLabel>
                  <div className="col-span-3">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Stock Type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="bought">
                          Bought
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="returned">
                          Returned
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {stockType === "bought" && (
              <>
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem className="py-2 grid grid-cols-4 items-center">
                      <FormLabel className="col-span-1 text-center">
                        Select Supplier
                      </FormLabel>
                      {/* open={supplierOpen} onOpenChange={setSupplierOpen} */}
                      <div className="col-span-3">
                        <Popover
                          open={supplierOpen}
                          onOpenChange={setSupplierOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? suppliersList.find(
                                      (supplier: any) =>
                                        supplier.value === field.value,
                                    )?.name
                                  : "Select Supplier"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 ">
                            <Command className="w-full">
                              <ScrollArea className="h-72 overflow-auto w-full">
                                <CommandInput placeholder="Search Supplier..." />
                                <CommandEmpty>No Supplier found.</CommandEmpty>
                                <CommandGroup>
                                  {suppliersList &&
                                    suppliersList?.map(
                                      (supplier: any, index: number) => (
                                        <CommandItem
                                          value={supplier.value}
                                          key={index}
                                          onSelect={() => {
                                            handleSelect(supplier);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              supplier.value === field.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />
                                          {supplier.name}
                                        </CommandItem>
                                      ),
                                    )}
                                </CommandGroup>
                              </ScrollArea>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoiceNo"
                  render={({ field }) => (
                    <FormItem className="py-2 grid grid-cols-4 items-center">
                      <FormLabel className="col-span-1 text-center">
                        Invoice Number
                      </FormLabel>
                      <FormControl className="col-span-3">
                        <Input type="text" placeholder="8034" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {stockType === "returned" && (
              <FormField
                control={form.control}
                name="jobCard"
                render={({ field }) => (
                  <FormItem className="py-2 grid grid-cols-4 items-center">
                    <FormLabel className="col-span-1 text-center">
                      Job Card
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        type="text"
                        placeholder="Wurth"
                        {...field}
                        // onChange={(event) => field.onChange(event.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="py-2 grid grid-cols-4 items-center">
                  <FormLabel className="col-span-1 text-center">
                    Quantity
                  </FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input type="number" placeholder="12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {stockType == "returned" && (
              <FormField
                control={form.control}
                name="returnedBy"
                render={({ field }) => (
                  <FormItem className="py-2 grid grid-cols-4 items-center">
                    <FormLabel className="col-span-1 text-center">
                      Select Person
                    </FormLabel>
                    <div className="col-span-3">
                      <Popover open={personOpen} onOpenChange={setPersonOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? employeeList.find(
                                    (employee: any) =>
                                      employee.value === field.value,
                                  )?.displayName
                                : "Select person"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 ">
                          <Command className="w-full">
                            <ScrollArea className="h-72 overflow-auto w-full">
                              <CommandInput placeholder="Search Supplier..." />
                              <CommandEmpty>No Person found.</CommandEmpty>
                              <CommandGroup>
                                {employeeList &&
                                  employeeList?.map(
                                    (supplier: any, index: number) => (
                                      <CommandItem
                                        value={supplier.value}
                                        key={index}
                                        onSelect={() => {
                                          personSelect(supplier);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            supplier.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {supplier.displayName}
                                      </CommandItem>
                                    ),
                                  )}
                              </CommandGroup>
                            </ScrollArea>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button disabled={!isValid || isSubmitting} type="submit">
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      <Toaster className="text-center" position="top-center" richColors />
    </Dialog>
  );
};

export default AddStockDialog;
