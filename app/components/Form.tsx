"use client";

import Link from "next/link";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const possibleoptions = [
  "light",
  "dark",
  "red",
  "purple4",
  "lmao",
  "light",
  "dark",
  "red",
  "green",
  "test",
  "purple5",
  "lmao",
  "light",
  "dark",
  "red",
  "greend",
  "test",
  "purple6",
  "lmao",
];
// how to retrieve value from the dropdown
export function SelectForm() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {possibleoptions.map((val, i) => {
          return (
            <SelectItem key={i} value={val}>
              {val}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
