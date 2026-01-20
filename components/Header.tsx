"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, EllipsisVertical } from "lucide-react";

export default function Header() {
  const { back } = useRouter();
  const pathname = usePathname();

  const pageTitleMap: Record<string, string> = {
    "/transactions": "Transações",
    "/config": "Configurações",
    "/debts": "Contas",
  };

  if (pathname != "/") {
    return (
      <header className="w-full h-12 border-b flex flex-row justify-between items-center border-gray-200 px-4">
        <button onClick={back}>
          <ArrowLeft strokeWidth={1} />
        </button>
        <h1 className="">{pageTitleMap[pathname]}</h1>
        <button>
          <EllipsisVertical strokeWidth={1} />
        </button>
      </header>
    );
  }
}
