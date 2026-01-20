"use client";

import { useEffect, useState } from "react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    fetchBalance();
  }, []);

  async function fetchBalance() {
    const response = await fetch("/api/balance");
    const data = await response.json();
    setBalance(data.balance);
    setExpenses(data.expenses);
  }

  return (
    <main className="flex flex-col gap-4 justify-center mt-3 px-2">
      <div className="w-full h-24 flex flex-col justify-center items-start gap-2 pl-4 bg-blue-500 text-white rounded-lg">
        <p className="text-sm font-light">Ativos Totais:</p>
        <p className={`text-2xl font-bold ${balance < 0 && "text-red-500"}`}>{formatCurrency(balance)}</p>
      </div>
      <div className="w-full h-24 flex flex-col justify-center items-start gap-2 pl-4 bg-fuchsia-600 text-white rounded-lg">
        <p className="text-sm font-light">Gastos Totais do Mês:</p>
        <p className="text-2xl font-bold">{formatCurrency(expenses)}</p>
      </div>
    </main>
  );
}
