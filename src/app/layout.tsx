import type { Metadata } from "next";
import { DM_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import EnvBadge from "@/components/EnvBadge";

// Display/heading font — replaced Bueno (hard to read on mobile) with a bolder,
// more legible grotesque that keeps brand character.
const bricolage = Bricolage_Grotesque({
  variable: "--font-display-src",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
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
      className={`${bricolage.variable} ${dmSans.variable} scroll-smooth`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col antialiased overflow-x-hidden bg-wm-green">
        {children}
        <EnvBadge />
      </body>
    </html>
  );
}
