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

const IssueDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="">
          Issue Item
        </Button>
      </DialogTrigger>
      {/* sm:max-w-[425px] */}
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            Issue Item: <span className="text-green-700">MGL-300</span>
          </DialogTitle>
          <DialogDescription>Fill the following details</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Car number
            </Label>
            <Input id="name" value="BMW 7629" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Job Card
            </Label>
            <Input id="username" value="JC1-3022" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Quantity
            </Label>
            <Input id="username" value="2" className="col-span-3" />
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <p className="text-right">Issued To</p>
            <div className="col-span-3">
              <SelectForm />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">Issue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDialog;
