"use client";

import { CreditsCards } from "@/@types";
import { useEffect, useState } from "react";

import MonthsCarousel from "@/components/MonthsCarousel";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import TotalExpensesCard from "@/components/TotalExpensesCard";
import TopExpensesCard from "@/components/TopExpensesCard";
import TopCCUsageCard from "@/components/TopCCUsageCard";
import UpcomingPaymentsCard from "@/components/UpcomingPaymentsCard";

interface CreditCardWithUsage extends CreditsCards {
  spent: number;
}

interface FixedExpense {
  id: number;
  description: string;
  value: number;
  due_day: number;
  category_id: number;
  payment_id: number;
  credit_card_id?: number | null;
  is_active: boolean;
  category_name?: string;
  payment_name?: string;
  credit_card_name?: string;
}

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [topExpenses, setTopExpenses] = useState<{ category: string; total: number }[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCardWithUsage[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<FixedExpense[]>([]);
  const [month, setMonth] = useState(0);
  const [year] = useState(new Date().getFullYear());
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  useEffect(() => {
    handleFixedExpensesDueToday();
    fetchTotalBalance();
    fetchTotalExpenses();
    fetchTopExpenses();
    fetchCreditCards();
    fetchUpcomingPayments();
  }, [month]);

  async function handleFixedExpensesDueToday() {
    try {
      await fetch("/api/fixed-expenses/due-today");
    } catch (error) {
      console.error("Erro ao processar despesas de hoje:", error);
    }
  }

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

  async function fetchUpcomingPayments() {
    try {
      const response = await fetch(`/api/fixed-expenses/upcoming?days=7&month=${month}&year=${year}`);
      const data = await response.json();
      setUpcomingPayments(data);
    } catch (error) {
      console.error("Erro ao buscar próximos pagamentos:", error);
    }
  }

  async function handleTogglePayment(id: number, isActive: boolean) {
    setIsLoadingPayments(true);
    try {
      const response = await fetch("/api/fixed-expenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          is_active: isActive,
        }),
      });

      if (response.ok) {
        await fetchUpcomingPayments();
      }
    } catch (error) {
      console.error("Erro ao atualizar despesa fixa:", error);
    } finally {
      setIsLoadingPayments(false);
    }
  }

  function handleMonthChange(value: number) {
    setMonth(value);
  }

  return (
    <main className="flex flex-col gap-4 pb-20 h-screen px-2.5 pt-2">
      <MonthsCarousel initialMonth={month} onChange={handleMonthChange} />

      <div className="flex flex-row gap-4">
        <TotalBalanceCard balance={balance} />
        <TotalExpensesCard expenses={expenses} />
      </div>

      <div className="flex-1 overflow-y-auto pb-14 space-y-4">
        {month === new Date().getMonth() && year === new Date().getFullYear() && <UpcomingPaymentsCard upcomingPayments={upcomingPayments} isLoading={isLoadingPayments} />}
        <TopExpensesCard topExpenses={topExpenses} />
        <TopCCUsageCard creditCards={creditCards} />
      </div>
    </main>
  );
}
