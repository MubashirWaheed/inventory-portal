"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// SCHEMA
const formSchema = z.object({
  employeeName: z.string().min(3).max(40),
});

const Settings = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeName: "",
    },
  });

  const { isValid, isSubmitting, isSubmitted, errors } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("values: ", values);
    try {
      await axios.post("/api/employees", values);
      form.reset();
      toast.success("Person Addded Successfully", {
        style: {
          fontSize: "16px",
        },
        className: "class",
      });
      // setOpen((prev) => false);
    } catch (error) {
      toast.error("Something went wrong", {
        style: {
          fontSize: "16px",
        },
        className: "class",
      });
      console.log("error: ", error);
    }
  };

  return (
    <div className="w-full px-8 pb-8 pt-6 ">
      <h2 className="font-bold text-xl tracking-tight">Add Employee</h2>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mt-2" size="sm">
            Add Employee
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>Fill the following details</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="employeeName"
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
        <Toaster className="text-center" position="top-center" richColors />
      </Dialog>
    </div>
  );
};

export default Settings;
