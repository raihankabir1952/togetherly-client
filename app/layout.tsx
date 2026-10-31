
import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Togetherly | Small Acts. Greater Impact.",
    template: "%s | Togetherly",
  },
  description:
    "Togetherly connects people who want to make a positive impact through community service events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>

        <div className="flex-1">{children}</div>

        <Footer />

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
