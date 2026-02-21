import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinControl",
  description: "App de Controle Financeiro Pessoal :)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="w-full h-full overflow-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} flex flex-col antialiased overflow-hidden`}>
        <Header />
        <main className="flex-1 overflow-hidden flex flex-col p-4">{children}</main>
        <Navbar />
      </body>
    </html>
  );
}
