"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightLeft, House, Wrench } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full h-16 absolute bottom-0 flex justify-around items-center border-t border-gray-200">
      <Link
        href="/"
        className={`flex flex-col justify-center items-center ${pathname == "/" && "text-blue-600 font-semibold"}`}
      >
        <House strokeWidth={1} />
        <span>Início</span>
      </Link>
      <Link
        href="/transactions"
        className={`flex flex-col justify-center items-center ${
          pathname == "/transactions" && "text-blue-600 font-semibold"
        }`}
      >
        <ArrowRightLeft strokeWidth={1} />
        <span>Transações</span>
      </Link>
      <Link
        href="/config"
        className={`flex flex-col justify-center items-center ${
          pathname == "/config" && "text-blue-600 font-semibold"
        }`}
      >
        <Wrench strokeWidth={1} />
        <span>Config</span>
      </Link>
    </nav>
  );
}
