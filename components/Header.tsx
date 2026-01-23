"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, EllipsisVertical, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const { back } = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pageTitleMap: Record<string, string> = {
    "/expenses": "Despesas Fixas",
    "/transactions": "Transações",
    "/configuration": "Configurações",
    "/credit-cards": "Cartões de Crédito",
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (pathname != "/") {
    return (
      <>
        <header className="relative w-full h-12 border-b flex flex-row justify-between items-center border-gray-200 px-4">
          <button onClick={back}>
            <ArrowLeft strokeWidth={1} />
          </button>
          <h1 className="">{pageTitleMap[pathname]}</h1>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <EllipsisVertical strokeWidth={1} /> : <EllipsisVertical strokeWidth={1} />}</button>
        </header>

        <section
          className={`w-1/2 fixed max-w-xs h-full px-5 py-4 shadow-xl bg-white top-0 right-0 border border-gray-200 z-10 transition-all duration-200 ease-out transform ${isMenuOpen ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-full pointer-events-none"}`}
        >
          <Link href="/configuration" className="flex items-center gap-2">
            <Wrench strokeWidth={1.25} size={20} />
            <span>Configurações</span>
          </Link>
        </section>
      </>
    );
  }
}
