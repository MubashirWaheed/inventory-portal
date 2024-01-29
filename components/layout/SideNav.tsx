"use client";
import Link from "next/link";

import { type NavItem } from "@/types/SideNav";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { buttonVariants } from "@/components/ui/button";

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
import { LayoutDashboard } from "lucide-react";

interface SideNavProps {
  items: NavItem[];
  setOpen?: (open: boolean) => void;
  className?: string;
}

export function SideNav({ items, setOpen, className }: SideNavProps) {
  // Make API request
  const { data, error, isLoading } = useSWR("/api/categories", fetcher);
  console.log("data: ", data);

  const path = usePathname();
  const { isOpen } = useSidebar();
  const [openItem, setOpenItem] = useState("");
  const [lastOpenItem, setLastOpenItem] = useState("");
  const { toggle } = useSidebar();

  useEffect(() => {
    if (isOpen) {
      console.log("lastOpenItem: ", lastOpenItem);
      setOpenItem(lastOpenItem);
    } else {
      setLastOpenItem(openItem);
      setOpenItem("");
    }
  }, [isOpen]);

  return (
    // display categories  based the data fetcehd from the DB
    <nav className=" space-y-2 flex flex-col">
      <div className="">
        {items.map((item, index) =>
          item.isChidren ? (
            <Accordion
              type="single"
              collapsible
              className="space-y-2"
              key={item.title}
              value={openItem}
              onValueChange={setOpenItem}
            >
              <AccordionItem value={item.title} className="border-none">
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
                    <item.icon className={cn(" h-5 w-5", item.color)} />
                  </div>
                  <div
                    className={cn(
                      "absolute left-12 text-base duration-200",
                      !isOpen && className,
                    )}
                  >
                    {item.title}
                  </div>

                  {isOpen && (
                    <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                  )}
                </AccordionTrigger>
                <AccordionContent className="ml-4 mt-2 space-y-2 pb-1">
                  {item.children?.map((child, index) => (
                    <Link
                      key={index}
                      href={child.href}
                      onClick={() => {
                        if (setOpen) setOpen(false);
                      }}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "group flex h-12 justify-start gap-x-3",
                        path === child.href &&
                          "bg-muted font-bold hover:bg-muted",
                      )}
                    >
                      <child.icon className={cn("h-5 w-5", child.color)} />
                      <div
                        className={cn(
                          "text-sm duration-200",
                          !isOpen && className,
                        )}
                      >
                        {child.title}
                      </div>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <Link
              key={item.title}
              href={item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "group relative flex h-12 justify-start",
                path === item.href && "bg-muted font-bold hover:bg-muted",
              )}
            >
              <item.icon className={cn("h-5 w-5", item.color)} />
              <span
                className={cn(
                  "absolute left-12 text-base duration-200",
                  !isOpen && className,
                )}
              >
                {item.title}
              </span>
            </Link>
          ),
        )}

        <Link
          key={1}
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
            {/* {item.title} */}
          </span>
        </Link>

        {/* <Accordion
          type="single"
          collapsible
          className="space-y-2"
          key={item.title}
          value={openItem}
          onValueChange={setOpenItem}
        >
          <AccordionItem value={item.title} className="border-none">
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
                <item.icon className={cn(" h-5 w-5", item.color)} />
              </div>
              <div
                className={cn(
                  "absolute left-12 text-base duration-200",
                  !isOpen && className,
                )}
              >
                {item.title}
              </div>

              {isOpen && (
                <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
              )}
            </AccordionTrigger>
            <AccordionContent className="ml-4 mt-2 space-y-2 pb-1">
              {item.children?.map((child, index) => (
                <Link
                  key={index}
                  href={child.href}
                  onClick={() => {
                    if (setOpen) setOpen(false);
                  }}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "group flex h-12 justify-start gap-x-3",
                    path === child.href && "bg-muted font-bold hover:bg-muted",
                  )}
                >
                  <child.icon className={cn("h-5 w-5", child.color)} />
                  <div
                    className={cn("text-sm duration-200", !isOpen && className)}
                  >
                    {child.title}
                  </div>
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}
      </div>
    </nav>
  );
}
