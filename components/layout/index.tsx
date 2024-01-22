"use client";
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/hooks/useSidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const logged = false;
  const path = usePathname();
  const { display, setDisplay } = useSidebar();
  const isLoginRoute = path === "/login";

  return (
    <div>
      <Header />
      <div className="flex h-screen border-collapse overflow-hidden">
        {display && !isLoginRoute && <Sidebar />}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 bg-secondary/10 pb-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
