"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightLeft, CalendarSync, CreditCard, House } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 flex justify-around items-center border-t border-gray-200 bg-white z-0">
      <Link href="/" className={`flex flex-col justify-center items-center ${pathname == "/" && "text-blue-600 font-semibold"}`}>
        <House strokeWidth={1} />
        <span>Início</span>
      </Link>
      <Link href="/transactions" className={`flex flex-col justify-center items-center ${pathname == "/transactions" && "text-blue-600 font-semibold"}`}>
        <ArrowRightLeft strokeWidth={1} />
        <span>Transações</span>
      </Link>
      <Link href="/credit-cards" className={`flex flex-col justify-center items-center ${pathname == "/credit-cards" && "text-blue-600 font-semibold"}`}>
        <CreditCard strokeWidth={1} />
        <span>Cartões</span>
      </Link>
      <Link href="/expenses" className={`flex flex-col justify-center items-center ${pathname == "/expenses" && "text-blue-600 font-semibold"}`}>
        <CalendarSync strokeWidth={1} />
        <span>Despesas</span>
      </Link>
    </nav>
  );
}
