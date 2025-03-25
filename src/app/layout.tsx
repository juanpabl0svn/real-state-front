import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TansTackQueryProvider from "@/providers/TansTackQueryProvider";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Espacio Morderno Imobiliario S.A.S",
  description:
    "Espacio Morderno Imobiliario S.A.S, la mejor inmobiliaria de Colombia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <TansTackQueryProvider>
            <Header />
            {children}
            <Toaster />
          </TansTackQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
