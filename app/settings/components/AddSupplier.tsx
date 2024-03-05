"use client";
import React, { useState } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const supplierSchema = z.object({
  supplierName: z
    .string()
    .min(2)
    .trim()
    .regex(/^[a-zA-Z\s]+$/),
});

const AddSupplier = () => {
  const [suppplierOpen, setSupplierOpen] = useState(false);

  const supplierForm = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      supplierName: "",
    },
  });

  const { isValid: isValidSupplier, isSubmitted: isSubmittedSupplier } =
    supplierForm.formState;

  const onSupplierSubmit = async (values: z.infer<typeof supplierSchema>) => {
    // make api request
    console.log("Values: ", values);
    try {
      await axios.post("/api/suppliers", { values });
      supplierForm.reset();
      toast.success("Person Addded Successfully", {
        style: {
          fontSize: "16px",
        },
        className: "class",
      });
      console.log("done");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-xl tracking-tight">Add Supplier</h2>
      <Dialog open={suppplierOpen} onOpenChange={setSupplierOpen}>
        <DialogTrigger asChild>
          <Button className="mt-2" size="sm">
            Add Supplier
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Supplier</DialogTitle>
            <DialogDescription>Fill the following details</DialogDescription>
          </DialogHeader>

          <Form {...supplierForm}>
            <form onSubmit={supplierForm.handleSubmit(onSupplierSubmit)}>
              <FormField
                control={supplierForm.control}
                name="supplierName"
                render={({ field }) => (
                  <FormItem className="grid py-2 grid-cols-4 items-center">
                    <FormLabel className="col-span-1 text-center">
                      Name
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <div>
                        <Input type="text" placeholder="A1248f8g" {...field} />
                        <FormMessage className="mt-1" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  disabled={!isValidSupplier || isSubmittedSupplier}
                  className="mt-4"
                  type="submit"
                >
                  Add Supplier
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
        <Toaster className="text-center" position="top-center" richColors />
      </Dialog>
    </div>
  );
};

export default AddSupplier;
