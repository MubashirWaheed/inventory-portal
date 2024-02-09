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

import { Toaster } from "@/components/ui/sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Product = {
  id: number;
  itemCode: string;
  company: string;
  quantity: number;
  categoryId: number;
};

const formSchema = z.object({
  quantity: z.coerce.number().min(1).positive().int().max(1000),
});

const AddStockDialog = ({ item }: { item: Product }) => {
  const { mutate } = useSWRConfig();
  const { itemCode, id: productId, categoryId, quantity } = item;

  console.log("item: ", item);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let operation = "ADD_STOCK";
    try {
      await axios.post(`/api/products/${productId}/add-stock`, {
        ...values,
        productId,
      });
      // await axios.put(`/api/products/${id}`, { ...values, id, operation });
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
      console.log("ERROR: ", error);
      toast.error("Error adding items to stock");
    }
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
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            Name: <span className="text-green-500">{itemCode}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Form here to update the quantity */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
