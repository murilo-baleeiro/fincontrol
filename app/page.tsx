"use client";

import { CreditsCards } from "@/@types";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

import MonthsCarousel from "@/components/MonthsCarousel";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import TotalExpensesCard from "@/components/TotalExpensesCard";
import TopExpensesCard from "@/components/TopExpensesCard";
import TopCCUsageCard from "@/components/TopCCUsageCard";

interface CreditCardWithUsage extends CreditsCards {
  spent: number;
}

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [topExpenses, setTopExpenses] = useState<{ category: string; total: number }[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCardWithUsage[]>([]);
  const [month, setMonth] = useState(0);
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchTotalBalance();
    fetchTotalExpenses();
    fetchTopExpenses();
    fetchCreditCards();
  }, [month]);

  async function fetchTotalBalance() {
    const response = await fetch(`/api/finances/balance?month=${month}&year=${year}`);
    const data = await response.json();
    setBalance(data.balance);
  }

  async function fetchTotalExpenses() {
    const response = await fetch(`/api/finances/expenses?month=${month}&year=${year}`);
    const data = await response.json();
    setExpenses(data.expenses);
  }

  async function fetchTopExpenses() {
    const response = await fetch(`/api/finances/top-expenses?month=${month}&year=${year}`);
    const data = await response.json();
    setTopExpenses(data);
  }

  async function fetchCreditCards() {
    try {
      const response = await fetch(`/api/credit-cards/usage?month=${month}&year=${year}`);
      const data = await response.json();
      setCreditCards(data);
    } catch (error) {
      console.error("Erro ao buscar cartões de crédito:", error);
    }
  }

  function handleMonthChange(value: number) {
    setMonth(value);
  }

  return (
    <main className="flex flex-col gap-4 justify-center px-2.5 pt-4">
      <MonthsCarousel initialMonth={month} onChange={handleMonthChange} />

      <div className="flex flex-row gap-4">
        <TotalBalanceCard balance={balance} />
        <TotalExpensesCard expenses={expenses} />
      </div>

      <TopExpensesCard topExpenses={topExpenses} />
      <TopCCUsageCard creditCards={creditCards} />
    </main>
  );
}
