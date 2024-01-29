"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
});

export function SelectForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("DONE");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        // w-2/3
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Issued to</FormLabel> */}
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the person" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">Kamran</SelectItem>
                  <SelectItem value="m@google.com">Hammad</SelectItem>
                  <SelectItem value="m@support.com">George</SelectItem>
                  <SelectItem value="m@support2.com">Javeed1</SelectItem>
                  <SelectItem value="m@support3.com">Javee2</SelectItem>
                  <SelectItem value="m@suppor4.com">Tab</SelectItem>
                  <SelectItem value="m@suppor5.com">Pop</SelectItem>
                  <SelectItem value="m@suppot.com">Hen</SelectItem>
                  <SelectItem value="m@suort.com">Can</SelectItem>
                  <SelectItem value="m@support.com">Doe</SelectItem>
                  <SelectItem value="m@su\pport.com">Foo</SelectItem>
                  <SelectItem value="m@port.com">Bar</SelectItem>
                  <SelectItem value="m2support.com">Shampoo</SelectItem>
                  <SelectItem value="msupport.com">Buz</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button type="submit">Submit</Button> */}
      </form>
    </Form>
  );
}
