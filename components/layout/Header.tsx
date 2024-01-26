"use client";
import Link from "next/link";

import React from "react";
import { Boxes } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

import { useSession } from "@clerk/nextjs";
import { UserNav } from "./UserNav";

const Header = () => {
  const { isLoaded, session, isSignedIn } = useSession();
  const firstName = session?.publicUserData.firstName;
  const email = session?.publicUserData.identifier;

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

        <div className={cn(" md:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session && <UserNav name={firstName} email={email} />}
        </div>
      </nav>
    </div>
  );
};

export default Header;
