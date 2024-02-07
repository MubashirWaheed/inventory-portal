"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useParams, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { mutate, useSWRConfig } from "swr";

const formSchema = z.object({
  itemCode: z
    .string()
    .min(3, {
      message: "Item code must be at least 3 characters.",
    })
    .max(35, {
      message: "Item code too long",
    })
    .trim(),
  company: z.string().min(3).max(50).trim(),
  quantity: z.coerce
    .number()
    .int()
    .positive()
    .gt(0)
    .refine((data) => data.toString().indexOf("-") === -1, {
      message: "Quantity cannot contain hyphens.",
    }),
});

const AddItemDialog = () => {
  const { categoryId } = useParams();
  const { mutate } = useSWRConfig();

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemCode: "",
      company: "",
      quantity: 1,
    },
  });

  const { isValid, isSubmitting, isSubmitted, errors } = form.formState;

  const onsubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/categories/${categoryId}`, values);
      toast.success("Item Added Successfully");
      mutate(`/api/categories/${categoryId}`);
      setOpen(false);
      form.reset();
      // mutate the data on success
    } catch (error: any) {
      console.log("error adding item: ", error);
      toast.error(error?.response?.data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Item </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)}>
            <FormField
              control={form.control}
              name="itemCode"
              render={({ field }) => (
                <FormItem className="grid py-2 grid-cols-4 items-center">
                  <FormLabel className="col-span-1 text-center">
                    Item Code
                  </FormLabel>
                  <FormControl className="col-span-3">
                    <div>
                      <Input type="text" placeholder="A1248f8g" {...field} />
                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="py-2 grid grid-cols-4 items-center">
                  <FormLabel className="col-span-1 text-center">
                    Company
                  </FormLabel>
                  <FormControl className="col-span-3">
                    <div>
                      <Input type="text" placeholder="Wurth" {...field} />
                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="py-2 grid grid-cols-4 items-center">
                  <FormLabel className="col-span-1 text-center">
                    Quantity
                  </FormLabel>
                  <FormControl className="col-span-3">
                    <div>
                      <Input type="number" placeholder="12" {...field} />
                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              {/* disable the button whne the item is being added */}
              <Button
                disabled={!isValid || isSubmitting}
                className="mt-4"
                type="submit"
              >
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
};

export default AddItemDialog;
