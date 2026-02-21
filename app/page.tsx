"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { monetaryFormatting } from "@/utils";
import ColorCard from "@/components/UI/ColorCard";
import MonthsSlider from "@/components/MonthsSlider";
import DonutChart from "@/components/UI/DonutChart";

interface CreditCardUsage {
  creditcard_id: number;
  creditcard_name: string;
  creditcard_usage: number;
  creditcard_limit: number;
}

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [creditCardsUsage, setCreditCardsUsage] = useState<CreditCardUsage[]>([]);

  const [month, setMonth] = useState(new Date().getMonth());
  const [year] = useState(new Date().getFullYear());

  const mockCategoryUsage = [
    { label: "Moradia", value: 1800, color: "#0EA5E9" },
    { label: "Alimentacao", value: 920, color: "#F97316" },
    { label: "Transporte", value: 540, color: "#22C55E" },
    { label: "Saude", value: 420, color: "#F59E0B" },
    { label: "Lazer", value: 360, color: "#A855F7" },
  ];

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`/api/finances/balance?month=${month + 1}&year=${year}`);
        if (response.ok) {
          const data = await response.json();
          setBalance(data.total_balance);
          setExpenses(data.total_outbound);
        } else {
          console.error("Failed to fetch balance data.");
        }
      } catch (error) {
        console.error("Error fetching balance data:", error);
      }
    };

    fetchBalance();

    const fetchCreditCardsUsage = async () => {
      try {
        const response = await fetch(`/api/finances/creditcards-usage?month=${month + 1}&year=${year}`);
        if (response.ok) {
          const data = await response.json();
          setCreditCardsUsage(data);
        } else {
          console.error("Failed to fetch credit cards usage data.");
        }
      } catch (error) {
        console.error("Error fetching credit cards usage data:", error);
      }
    };

    fetchCreditCardsUsage();

    const fetchExpensesBycategories = async () => {
      try {
        const response = await fetch(`/api/finances/expenses-by-category?month=${month + 1}&year=${year}`);
        if (response.ok) {
          const data = await response.json();
          setExpensesByCategory(data);
        } else {
          console.error("Failed to fetch expenses by category data.");
        }
      } catch (error) {
        console.error("Error fetching expenses by category data:", error);
      }
    };

    fetchExpensesBycategories();
  }, [month, year]);

  function handleMonthChange(value: number) {
    setMonth(value);
  }

  return (
    <main className={`overflow-auto pb-20 pt-12 flex flex-col gap-4 ${usePathname() === "/" && "pt-15"}`}>
      <MonthsSlider initialMonth={month} onChange={handleMonthChange} />

      <div className="flex flex-row gap-4 items-center">
        <ColorCard color="blue">
          <p className="text-sm font-light">Ativos Totais:</p>
          <p className="text-2xl font-bold">{monetaryFormatting(balance)}</p>
        </ColorCard>
        <ColorCard color="purple">
          <p className="text-sm font-light">Gastos do Mês:</p>
          <p className="text-2xl font-bold">{monetaryFormatting(expenses)}</p>
        </ColorCard>
      </div>

      <ColorCard color="orange">
        <p className="text-sm font-light">Uso dos Cartões:</p>
        <div className="w-full pr-4 mt-4 space-y-3 flex flex-col gap-2">
          {creditCardsUsage.length > 0 ? (
            creditCardsUsage.map(({ creditcard_id, creditcard_name, creditcard_usage, creditcard_limit }) => (
              <div key={creditcard_id} className="">
                <p className="font-normal border-b border-white/30 pb-1">{creditcard_name}</p>
                <div className="flex items-center justify-between text-sm pt-1.5">
                  <p className="font-light">
                    Utilizado:<strong className="font-semibold"> {monetaryFormatting(creditcard_usage)}</strong>
                  </p>
                  <p className="font-light">
                    Limite: <strong className="font-semibold">{monetaryFormatting(creditcard_limit)}</strong>
                  </p>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-white/30">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{
                      width: `${(creditcard_usage / creditcard_limit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm font-light text-red-100">Nenhum cartão de crédito cadastrado.</div>
          )}
        </div>
      </ColorCard>

      <ColorCard color="gray">
        <p className="text-sm font-light">Maiores Gastos por Categoria:</p>
        <div className="w-full pr-4 mt-4">
          <DonutChart data={expensesByCategory} title="Gastos" />
        </div>
      </ColorCard>
    </main>
  );
}
