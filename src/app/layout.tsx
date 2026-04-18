import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { MenuProvider } from "@/context/menu-context";
import "./globals.css";

const bueno = localFont({
  src: "../../public/fonts/Bueno.woff2",
  variable: "--font-bueno",
  display: "swap",
  fallback: ["Impact", "Arial Black", "sans-serif"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Washermann — Clean Clothes, Zero Stress",
  description:
    "Nigeria's premium on-demand laundry service. Schedule a pickup, track your order, and get your clothes back fresh.",
  keywords: ["laundry", "dry cleaning", "pickup", "delivery", "Nigeria", "Lagos"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bueno.variable} ${dmSans.variable} scroll-smooth`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col antialiased overflow-x-hidden">
          <MenuProvider>{children}</MenuProvider>
        </body>
    </html>
  );
}
