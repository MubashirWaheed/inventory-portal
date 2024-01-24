"use client";
import Link from "next/link";
import { Button } from "../ui/button";

import React from "react";
import { Boxes } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname, useRouter } from "next/navigation";

import { useClerk, useSession } from "@clerk/nextjs";
import { UserNav } from "./UserNav";
import { useSidebar } from "@/hooks/useSidebar";

const Header = () => {
  const path = usePathname();

  const { display, setDisplay } = useSidebar();
  const isLoginRoute = path === "/sign-in";

  const router = useRouter();
  const { isLoaded, session, isSignedIn } = useSession();
  const firstName = session?.publicUserData.firstName;
  const email = session?.publicUserData.identifier;
  console.log("session:  ", session);

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

        {/* {display && !isLoginRoute && ( */}
        <div className={cn(" md:!hidden")}>
          <MobileSidebar />
        </div>
        {/* )} */}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <UserNav name={firstName} email={email} />
          ) : (
            <Button
              size="sm"
              onClick={() => {
                console.log("Button clicked");
              }}
            >
              Sign In
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
