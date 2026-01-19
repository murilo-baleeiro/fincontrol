"use client";

import { useEffect, useState } from "react";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Home() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      const response = await fetch("/api/balance");
      const data = await response.json();
      setBalance(data.balance);
    }

    fetchBalance();
  }, []);

  return (
    <main className="flex justify-center mt-3 px-2">
      <div className="w-full h-24 flex flex-col justify-center items-start gap-2 pl-4 bg-blue-500 text-white rounded-lg">
        <p className="text-sm font-light">Ativos Totais:</p>
        <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
      </div>
    </main>
  );
}
