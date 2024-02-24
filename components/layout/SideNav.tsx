"use client";
import Link from "next/link";
import { List, Settings } from "lucide-react";
import { type NavItem } from "@/types/SideNav";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { buttonVariants } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/layout/SubnavAccordion";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import useSWR from "swr";
import { fetcher } from "@/lib/fetecher";
import { LayoutDashboard, ListTodo } from "lucide-react";

interface SideNavProps {
  items: NavItem[];
  setOpen?: (open: boolean) => void;
  className?: string;
}

export function SideNav({ items, setOpen, className }: SideNavProps) {
  const { data, error } = useSWR("/api/categories", fetcher);

  const path = usePathname();
  const { isOpen } = useSidebar();
  const [openItem, setOpenItem] = useState("");
  const [lastOpenItem, setLastOpenItem] = useState("");
  const { toggle } = useSidebar();

  useEffect(() => {
    if (isOpen) {
      setOpenItem(lastOpenItem);
    } else {
      setLastOpenItem(openItem);
      setOpenItem("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (error) {
      toast.error(error?.response?.data);
    }
  }, [error]);

  useEffect(() => {
    console.log("data for category:", data);
  }, [data]);

  return (
    <nav className="space-y-2 flex flex-col">
      <div className="">
        {/* DASHBOARD */}
        <Link
          href={"/"}
          onClick={() => {
            if (setOpen) setOpen(false);
          }}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "group relative flex h-12 justify-start",
            path === "/" && "bg-muted font-bold hover:bg-muted",
          )}
        >
          <LayoutDashboard className={cn("h-5 w-5 text-sky-500")} />
          <span
            className={cn(
              "absolute left-12 text-base duration-200",
              !isOpen && className,
            )}
          >
            Dashboard
          </span>
        </Link>

        {/* CATEGORIES */}
        <Accordion
          type="single"
          collapsible
          className="space-y-2"
          value={openItem}
          onValueChange={setOpenItem}
        >
          <AccordionItem value={"Categories"} className="border-none">
            <AccordionTrigger
              onClick={() => {
                !isOpen && toggle();
              }}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "group relative flex h-12 justify-between px-4 py-2 text-base duration-200 hover:bg-muted hover:no-underline",
              )}
            >
              <div>
                <List className={cn(" h-5 w-5 text-orange-500")} />
              </div>
              <div
                className={cn(
                  "absolute left-12 text-base duration-200",
                  !isOpen && className,
                )}
              >
                Categories
              </div>
              {isOpen && (
                <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
              )}
            </AccordionTrigger>
            <AccordionContent className="ml-4 mt-2 space-y-2 pb-1">
              {/* id of the category when using nano id */}
              {data?.map((item: any, index: number) => {
                console.log("id:", item.id);
                return (
                  <Link
                    key={index}
                    href={`/categories/${item.id}`}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "group flex h-12 justify-start gap-x-3",
                      path === `/categories/${item.id}` &&
                        "bg-muted font-bold hover:bg-muted",
                    )}
                  >
                    <ListTodo className={cn("h-5 w-5 text-red-500")} />
                    <div
                      className={cn(
                        "text-sm duration-200",
                        !isOpen && className,
                      )}
                    >
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Link
          href={"/settings"}
          onClick={() => {
            if (setOpen) setOpen(false);
          }}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "group relative flex h-12 justify-start",
            path === "/settings" && "bg-muted font-bold hover:bg-muted",
          )}
        >
          <Settings className={cn("h-5 w-5 text-sky-500")} />
          <span
            className={cn(
              "absolute left-12 text-base duration-200",
              !isOpen && className,
            )}
          >
            Settings
          </span>
        </Link>
        <Toaster />
      </div>
    </nav>
  );
}
