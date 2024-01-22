"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className={inter.className}>
        <div>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Layout>{children}</Layout>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
