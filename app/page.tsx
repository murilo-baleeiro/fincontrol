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

  const maxValueTopExpenses = Math.max(...topExpenses.map((e) => e.total));
  const maxValueTopRecipes = Math.max(
    ...[
      { category: "Salário", total: 2450 },
      { category: "Freelance", total: 280 },
    ].map((e) => e.total),
  );

  return (
    <main className="flex flex-col gap-4 justify-center px-2.5 pt-4">
      <div className="w-full h-24 flex flex-col justify-center items-start gap-2 pl-4 bg-blue-500 text-white rounded-lg shadow-md">
        <p className="text-sm font-light">Ativos Totais:</p>
        <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
      </div>

      <div className="w-full h-24 flex flex-col justify-center items-start gap-2 pl-4 bg-fuchsia-600 text-white rounded-lg shadow-md">
        <p className="text-sm font-light">Gastos Totais do Mês:</p>
        <p className="text-2xl font-bold">{formatCurrency(expenses)}</p>
      </div>

      <div className="w-full rounded-lg bg-amber-500 p-4 text-white shadow-md">
        <h2 className="text-sm font-light">Maiores Gastos por Tipo:</h2>
        <div className="mt-4 space-y-3">
          {topExpenses.length > 0 ? (
            topExpenses.map((expense) => (
              <div key={expense.category}>
                <div className="flex items-center justify-between text-sm">
                  <span>{expense.category}</span>
                  <span className="font-semibold">{formatCurrency(expense.total)}</span>
                </div>

                <div className="mt-1 h-2 w-full rounded-full bg-white/30">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{
                      width: `${(expense.total / maxValueTopExpenses) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm font-light text-orange-100">Nenhum gasto categorizado registrado.</div>
          )}
        </div>
      </div>

      <div className="w-full rounded-lg bg-emerald-500 p-4 text-white shadow-md">
        <h2 className="text-sm font-light">Maiores Fontes de Receita por Tipo:</h2>
        <div className="mt-4 space-y-3">
          {true ? (
            [
              { category: "Salário", total: 2450 },
              { category: "Freelance", total: 280 },
            ].map((recipe) => (
              <div key={recipe.category}>
                <div className="flex items-center justify-between text-sm">
                  <span>{recipe.category}</span>
                  <span className="font-semibold">{formatCurrency(recipe.total)}</span>
                </div>

                <div className="mt-1 h-2 w-full rounded-full bg-white/30">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{
                      width: `${(recipe.total / maxValueTopRecipes) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm font-light text-emerald-100">Nenhuma receita categorizado registrada.</div>
          )}
        </div>
      </div>
    </main>
  );
}
