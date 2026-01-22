"use client";

import { CreditsCards } from "@/@types";
import { useEffect, useState } from "react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

interface CreditCardWithUsage extends CreditsCards {
  spent: number;
}

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [topExpenses, setTopExpenses] = useState<{ category: string; total: number }[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCardWithUsage[]>([]);

  useEffect(() => {
    fetchBalance();
    fetchExpenses();
    fetchTopExpenses();
    fetchCreditCards();
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

  async function fetchCreditCards() {
    try {
      const response = await fetch("/api/credit-cards/usage");
      const data = await response.json();
      setCreditCards(data);
    } catch (error) {
      console.error("Erro ao buscar cartões de crédito:", error);
    }
  }

  const maxValueTopExpenses = Math.max(...topExpenses.map((e) => e.total));

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

      <div className="w-full rounded-lg bg-red-700 p-4 text-white shadow-md">
        <h2 className="text-sm font-light">Cartões de Crédito:</h2>
        <div className="mt-4 space-y-3">
          {creditCards.length > 0 ? (
            creditCards.map((card) => (
              <div key={card.id}>
                <div className="flex items-center justify-between text-sm">
                  <p className="flex flex-row gap-1">
                    <span className="font-light">{card.name}</span>
                    <span className="font-semibold">{formatCurrency(card.spent)}</span>
                  </p>
                  <p className="font-semibold">Limite: {formatCurrency(card.card_limit)}</p>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-white/30">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{
                      width: `${(card.spent / card.card_limit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm font-light text-red-100">Nenhum cartão de crédito cadastrado.</div>
          )}
        </div>
      </div>
    </main>
  );
}
