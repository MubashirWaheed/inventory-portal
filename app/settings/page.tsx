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
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// write schema for the employees form

const Settings = () => {
  const form = useForm({
    defaultValues: {
      employeeName: "",
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = async (values: any) => {
    console.log("values: ", values);
    try {
      const res = await axios.post("/api/employees", values);
    } catch (error) {
      console.log("error: ", error);
    }
    console.log("submitted");
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
                      <Input type="text" placeholder="A1248f8g" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button className="mt-4" type="submit">
                  Add
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
