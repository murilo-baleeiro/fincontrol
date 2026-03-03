"use client";

import { useEffect, useState, useCallback } from "react";

interface CreditCardUsage {
  creditcard_id: number;
  creditcard_name: string;
  creditcard_usage: number;
  creditcard_limit: number;
}

export default function useHome() {
  const year = new Date().getFullYear();

  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([]);
  const [creditCardsUsage, setCreditCardsUsage] = useState<CreditCardUsage[]>([]);

  const [month, setMonth] = useState(() => new Date().getMonth());
 
  const fetchBalance = async () => {
    try {
      const res = await fetch(`/api/finances/balance?month=${month + 1}&year=${year}`, { credentials: "include" });
      if (!res.ok) throw new Error("balance request failed");
      const data = await res.json();
      setBalance(data.total_balance);
      setExpenses(data.total_outbound);
    } catch (err) {
      console.error("fetchBalance error", err);
    }
  };

  const fetchCreditCardsUsage = async () => {
    try {
      const res = await fetch(`/api/finances/creditcards-usage?month=${month + 1}&year=${year}`, { credentials: "include" });
      if (!res.ok) throw new Error("credit cards usage request failed");
      const data = await res.json();
      setCreditCardsUsage(data);
    } catch (err) {
      console.error("fetchCreditCardsUsage error", err);
    }
  };

  const fetchExpensesByCategory = async () => {
    try {
      const res = await fetch(`/api/finances/expenses-by-category?month=${month + 1}&year=${year}`, { credentials: "include" });
      if (!res.ok) throw new Error("expenses-by-category request failed");
      const data = await res.json();
      setExpensesByCategory(data);
    } catch (err) {
      console.error("fetchExpensesByCategory error", err);
    }
  };

  const loadData = async () => {
    await Promise.all([fetchBalance(), fetchCreditCardsUsage(), fetchExpensesByCategory()]);
  };

  useEffect(() => {
    loadData();
  }, [month, year]);

  const handleMonthChange = useCallback((value: number) => {
    setMonth(value);
  }, []);

  return {
    balance,
    expenses,
    expensesByCategory,
    creditCardsUsage,
    month,
    year,
    handleMonthChange,
  };
}
