"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightLeft, CalendarSync, CreditCard, House } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 flex justify-around items-center bg-white z-0">
      <Link
        href="/"
        className={`flex-1 flex flex-col justify-center items-center border-t border-gray-200 py-2 ${pathname == "/" && "text-blue-600 font-semibold border-t-blue-600"}`}
      >
        <House strokeWidth={1} />
        <span>Início</span>
      </Link>
      <Link
        href="/transactions"
        className={`flex-1 flex flex-col justify-center items-center border-t border-gray-200 py-2 ${pathname == "/transactions" && "text-blue-600 font-semibold border-t-blue-600 "}`}
      >
        <ArrowRightLeft strokeWidth={1} />
        <span>Transações</span>
      </Link>
      <Link
        href="/credit-cards"
        className={`flex-1 flex flex-col justify-center items-center border-t border-gray-200 py-2 ${pathname == "/credit-cards" && "text-blue-600 font-semibold border-t-blue-600"}`}
      >
        <CreditCard strokeWidth={1} />
        <span>Cartões</span>
      </Link>
      <Link href="/monthly" className={`flex-1 flex flex-col justify-center items-center border-t border-gray-200 py-2 ${pathname == "/monthly" && "text-blue-600 font-semibold border-t-blue-600"}`}>
        <CalendarSync strokeWidth={1} />
        <span>Mensal</span>
      </Link>
    </nav>
  );
}
