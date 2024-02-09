"use client";
import { useSWRConfig } from "swr";
import { Button } from "@/components/ui/button";

import toast, { Toaster } from "react-hot-toast";

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
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  category: z
    .string()
    .min(3, {
      message: "Category must be at least 2 characters.",
    })
    .max(30)
    .trim()
    .refine((value) => /^[a-zA-Z0-9-]+$/.test(value), {
      message: "Category can only contain letters, numbers, and hyphens.",
    }),
});

const CreateCategoryDialog = () => {
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
    },
  });

  const { isValid, isSubmitting, isSubmitted, errors } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { category } = values;

    try {
      await axios.post("/api/categories", { category });
      toast.success("Category created");
      setOpen(false);
      form.reset();
      mutate("/api/categories");
    } catch (error: any) {
      console.log("error from the backend: ", error);
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
          <Button size="sm" variant="default">
            Create Category
          </Button>
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
                        <div>
                          <Input
                            disabled={isSubmitting}
                            type="text"
                            placeholder="oil-filters"
                            {...field}
                          />
                          <FormMessage />
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
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
};

export default CreateCategoryDialog;
