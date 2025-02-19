"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/reset-password" || pathname === "/forgot-password";

  return (
    <html lang="en">
      <ThemeProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ReactQueryProvider>
            <div className="flex flex-col min-h-screen bg-homeBackground dark:bg-card ">
              {!hideSidebar && <Navbar />}
              <div
                className={`w-full h-screen ${!hideSidebar ? "flex-1 mt-16 " : "max-w-full "
                  }`}
              >{children}</div>
            </div>
          </ReactQueryProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
