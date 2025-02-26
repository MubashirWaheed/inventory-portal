import React, { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { NavItems } from "@/components/constants/SideNav";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const [swith, setSwitch] = useState(false);

  const handleToggle = () => {
    setSwitch(true);
    toggle();
    setTimeout(() => setSwitch(false), 500);
  };

  return (
    <nav
      className={cn(
        `relative hidden h-screen border-r pt-16 md:block overflow-y-auto`,
        swith && "duration-500",
        isOpen ? "w-72" : "w-[78px]",
        className,
      )}
    >
      <div className="h-full">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <SideNav
              className="text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
              items={NavItems}
            />
          </div>
        </div>
        <div className="w-full space-y-2 px-3  pb-2">
          <Separator />
          <Button
            onClick={handleToggle}
            className={cn("h-10 w-full bg-foreground", isOpen && "rotate-180")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
