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
  const [topExpenses, setTopExpenses] = useState<{ category: string; total: number }[]>([]);

  useEffect(() => {
    fetchBalance();
    fetchExpenses();
    fetchTopExpenses();
  }, []);

  async function fetchBalance() {
    const response = await fetch("/api/finances/balance");
    const data = await response.json();
    setBalance(data.balance);
  }

  async function fetchExpenses() {
    const response = await fetch("/api/finances/expenses");
    const data = await response.json();
    setExpenses(data.expenses);
  }

  async function fetchTopExpenses() {
    const response = await fetch("/api/finances/top-expenses");
    const data = await response.json();
    setTopExpenses(data);
  }

  const maxValue = Math.max(...topExpenses.map((e) => e.total));

  return (
    <main className="flex flex-col gap-4 justify-center mt-3 px-2">
      <div className="w-full h-24 flex flex-col justify-center items-start gap-2 pl-4 bg-blue-500 text-white rounded-lg">
        <p className="text-sm font-light">Ativos Totais:</p>
        <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
      </div>
      <div className="w-full h-24 flex flex-col justify-center items-start gap-2 pl-4 bg-fuchsia-600 text-white rounded-lg">
        <p className="text-sm font-light">Gastos Totais do Mês:</p>
        <p className="text-2xl font-bold">{formatCurrency(expenses)}</p>
      </div>

      <div className="w-full rounded-lg bg-amber-500 p-4 text-white shadow-sm">
        <h2 className="text-sm font-light">Maiores Gastos por Tipo:</h2>
        <div className="mt-4 space-y-3">
          {topExpenses.length > 0 ? topExpenses.map((expense) => (
            <div key={expense.category}>
              <div className="flex items-center justify-between text-sm">
                <span>{expense.category}</span>
                <span className="font-semibold">{formatCurrency(expense.total)}</span>
              </div>

              <div className="mt-1 h-2 w-full rounded-full bg-white/30">
                <div
                  className="h-2 rounded-full bg-white"
                  style={{
                    width: `${(expense.total / maxValue) * 100}%`,
                  }}
                />
              </div>
            </div>
          )): (<div className="text-sm font-light text-orange-100">Nenhum gasto categorizado registrado.</div>)}
        </div>
      </div>
    </main>
  );
}
