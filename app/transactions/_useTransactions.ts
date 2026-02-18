"use client";

import { useState, useEffect, useRef, FormEvent, use } from "react";

interface TransactionData {
  id: number;
  description: string;
  value: number;
  action: "inbound" | "outbound";
  date: string;
}

export default function useTransactions() {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionData[] | null>(null);
  const [action, setAction] = useState<"inbound" | "outbound" | null>(null);
  const [category, setCategory] = useState<number | null>(null);
  const [payment, setPayment] = useState<number | null>(null);
  const [categories, setCategories] = useState<{
    inbound: { id: number; name: string }[];
    outbound: { id: number; name: string }[];
    payments: { id: number; name: string }[];
  } | null>(null);

  useEffect(() => {
    fetchTransactionData.current();
    fetchCategories.current();
  }, []);

  const fetchTransactionData = useRef(async () => {
    try {
      const response = await fetch("/api/transactions");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Transaction Data:", data);
        setTransactionData(data);
      } else {
        console.error("Failed to fetch transaction data.");
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  });

  const fetchCategories = useRef(async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Inbound Categories:", data);
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching inbound categories:", error);
    }
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const [description, value] = [formData.get("description") as string, parseFloat((formData.get("value") as string).replace(/\./g, "").replace(",", "."))];

    console.log(`Descrição: ${description}\nValor: R$ ${value.toFixed(2)}\nData: ${date}\nAção: ${action}\nCategoria: ${category}\nPagamento: ${payment}`);

    fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, value, action, date, category, payment }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Transaction data submitted successfully!");
          e.currentTarget.reset();
        } else {
          console.error("Failed to submit transaction data.");
        }
      })
      .finally(() => {
        console.log("Submission attempt completed.");
        fetchTransactionData.current();
      });
  };

  const handleDelete = (id: number) => {
    fetch(`/api/transactions?id=${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Transaction entry #${id} deleted successfully!`);
          fetchTransactionData.current();
        } else {
          console.error(`Failed to delete transaction entry #${id}.`);
        }
      })
      .finally(() => {
        console.log("Deletion attempt completed.");
      });
  };

  return {
    date,
    today,
    action,
    payment,
    category,
    categories,
    openCardId,
    transactionData,
    setDate,
    setAction,
    setCategory,
    handleSubmit,
    handleDelete,
    setOpenCardId,
    setPayment,
  };
}
