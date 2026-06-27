import React from "react";
import type { Metadata } from "next";
import NextNavbar from "../components/nextjs/NextNavbar";
import NextFooter from "../components/nextjs/NextFooter";
import "../lib/index.css";

export const metadata: Metadata = {
  title: "Woodworker Marketplace & Academy | Hands-on Woodcraft Workshops",
  description: "Find local green woodworking, cabinet-making, timber-framing, and wood lathe spinning classes in the UK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased font-sans">
        <NextNavbar />
        <div className="flex-grow">
          {children}
        </div>
        <NextFooter />
      </body>
    </html>
  );
}
