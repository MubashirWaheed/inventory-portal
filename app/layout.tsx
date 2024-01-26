"use client";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="light" style={{ colorScheme: "light" }}>
        <body className={inter.className}>
          <div>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Layout>{children}</Layout>
            </ThemeProvider>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
