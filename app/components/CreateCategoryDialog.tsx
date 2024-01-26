"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const CreateCategoryDialog = () => {
  const [open, setOpen] = useState(false);

  const form = useForm();

  const onSubmit = async (values: any) => {
    const { category } = values;
    console.log("HELLO MF", values);
    const res = await axios.post("/api/category", { category });
    console.log("why res not being logged: ", res);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <div className="gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Category" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* how to close this dialog on successful category creation */}
              <DialogFooter>
                <Button
                  onClick={() => setOpen(false)}
                  className="mt-4"
                  type="submit"
                >
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
