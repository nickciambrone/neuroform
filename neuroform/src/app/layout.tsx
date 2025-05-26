"use client";

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import MinimalNavbar from "@/components/MinimalNavbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <LayoutWithDynamicNavbar>{children}</LayoutWithDynamicNavbar>
        </AuthProvider>
      </body>
    </html>
  );
}

function LayoutWithDynamicNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [useMinimal, setUseMinimal] = useState(false);

  useEffect(() => {
    setUseMinimal(["/login", "/signup"].includes(pathname));
  }, [pathname]);

  return (
    <>
      {useMinimal ? <MinimalNavbar /> : <Navbar />}
      <div style={{ paddingTop: "10px" }} className="bg-gray-50 dark:bg-black">
        {children}
      </div>
    </>
  );
}
