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
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectForm } from "./Select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";

const AddItem = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="">
          Add Item
        </Button>
      </DialogTrigger>
      {/* sm:max-w-[425px] */}
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add Item the catgory</DialogTitle>
          {/* <DialogDescription>Add Item the catgory</DialogDescription> */}
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Item Code
            </Label>
            <Input id="name" value="A52700656" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Company
            </Label>
            <Input id="username" value="Wurth" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Quantity
            </Label>
            <Input id="username" value="2" className="col-span-3" />
          </div>
          {/* <div className=" grid grid-cols-4 items-center gap-4">
            <p className="text-right">Issued To</p>
            <div className="col-span-3">
              <SelectForm />
            </div>
          </div> */}
        </div>

        <DialogFooter>
          <Button type="submit">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItem;
