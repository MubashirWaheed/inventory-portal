import { useSWRConfig } from "swr";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useEmployees } from "@/hooks/useEmployees";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Employee {
  id: number;
  displayName: string;
  value: string;
}

type Product = {
  id: number;
  itemCode: string;
  company: string;
  quantity: number;
  categoryId: number;
};

// APPLY DATA VALIDATION FOR JOB CARD
const issueFormSchema = z
  .object({
    dateOfIssue: z.date(),
    jobCard: z.string().trim(),
    quantity: z.coerce.number().gt(0).max(20).positive(),
    issuedTo: z.string().min(1, { message: "please select person" }),
    linkTo: z.string(),
  })
  .refine((input) => {
    console.log("input.linkTo: ", input.linkTo);
    if (input.linkTo !== "garage" && input.jobCard == "") {
      return false;
    }
    return true;
  });

const IssueDialog = ({ item }: { item: Product }) => {
  const { employeeList } = useEmployees();
  const { mutate } = useSWRConfig();
  console.log("employeeList: ", employeeList);

  const form = useForm({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      linkTo: "jobCard",
      dateOfIssue: new Date(),
      jobCard: "",
      quantity: 1,
      issuedTo: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const { itemCode, id, categoryId, quantity } = item;
  const [open, setOpen] = useState(false);

  const showJobCard = form.watch("linkTo");

  const onSubmit = async (values: z.infer<typeof issueFormSchema>) => {
    console.log("VALUES: ", values);
    try {
      await axios.post(`/api/products/${id}/issue-product`, { ...values, id });
      mutate(`/api/categories/${categoryId}`);
      mutate(`/api/dashboard/current-stock`);

      setOpen((prev) => false);
      toast.success("Item issued Successfully");
    } catch (error) {
      console.log("error:", error);
      // @ts-ignore
      toast.error(error?.response?.data);
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">Issue Item</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Issue Item: <span className="text-green-700">{itemCode}</span>
            </DialogTitle>
            <DialogDescription>Fill the following details</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="linkTo"
                render={({ field }) => (
                  <FormItem className="grid py-2 grid-cols-4 items-center">
                    <FormLabel className="col-span-1 text-center">
                      Link To
                    </FormLabel>
                    <div className="col-span-3">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Link" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem
                            className="cursor-pointer"
                            value="jobCard"
                          >
                            Job Card
                          </SelectItem>
                          <SelectItem className="cursor-pointer" value="garage">
                            Garage
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {showJobCard === "jobCard" && (
                <FormField
                  control={form.control}
                  name="jobCard"
                  render={({ field }) => (
                    <FormItem className="py-2 grid grid-cols-4 items-center">
                      <FormLabel className="col-span-1 text-center">
                        Job Card
                      </FormLabel>
                      <FormControl className="col-span-3">
                        <Input type="text" placeholder="Wurth" {...field} />
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
                        <Input
                          type="number"
                          placeholder="12"
                          {...field}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issuedTo"
                render={({ field }) => (
                  <FormItem className="grid py-2 grid-cols-4 items-center">
                    <FormLabel className="col-span-1 text-center">
                      Issued To
                    </FormLabel>
                    <div className="col-span-3">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select person" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {employeeList &&
                            employeeList.map(
                              (
                                { displayName, value, id }: Employee,
                                index: number,
                              ) => (
                                <SelectItem
                                  key={index}
                                  className="cursor-pointer"
                                  value={`${id}`}
                                >
                                  {displayName}
                                </SelectItem>
                              ),
                            )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfIssue"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center">
                    <FormLabel className="col-span-1 text-center">
                      Date of Issue
                    </FormLabel>
                    <div className="col-span-3 ">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  disabled={!isValid || isSubmitting}
                  className="mt-4"
                  type="submit"
                >
                  Issue
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
};

export default IssueDialog;
