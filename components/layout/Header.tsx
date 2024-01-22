"use client";
import Link from "next/link";
import { Button } from "../ui/button";

import React from "react";
import { Boxes } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useRouter } from "next/navigation";
const Header = () => {
  const router = useRouter();
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-16 items-center justify-between px-4">
        <Link
          href={"/"}
          className="hidden items-center justify-between gap-2 md:flex"
        >
          <Boxes className="h-6 w-6" />
          <h1 className="text-lg font-semibold">Inventory Portal</h1>
        </Link>
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* {sessionData ? (
            <UserNav user={sessionData} />
          ) : (
            <Button
              size="sm"
              onClick={() => {
                console.log("Button clicked");
                // void signIn();
              }}
            >
              Sign In
            </Button>
          )} */}
          <Button onClick={() => router.push("/login")} className="sm">
            Sign In
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Header;
