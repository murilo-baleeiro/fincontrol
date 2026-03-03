"use client";

import { useState, useEffect, useRef, FormEvent, use, ChangeEvent } from "react";

interface TransactionData {
  id: number;
  description: string;
  value: number;
  action: "inbound" | "outbound";
  date: string;
  category: number | null;
  payment: number | null;
  creditcard: number | null;
  created_at: string;
}

export default function useTransactions() {
  const today = new Date().toISOString().split("T")[0];

  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[] | null>(null);

  const [formData, setFormData] = useState<any>({
    description: "",
    value: 0,
    action: null,
    date: today,
    category: null,
    payment: null,
    creditcard: null,
  });
  const [creditCards, setCreditCards] = useState<{ id: number; name: string }[] | null>(null); // Lista de cartões de crédito disponíveis
  const [categories, setCategories] = useState<{
    inbound: { id: number; name: string }[];
    outbound: { id: number; name: string }[];
    payments: { id: number; name: string }[];
  } | null>(null);

  useEffect(() => {
    fetchTransactionData.current();
    fetchCategories.current();
    fetchCreditCards.current();
  }, []);

  const fetchTransactionData = useRef(async () => {
    try {
      const response = await fetch("/api/transactions", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Transaction Data:", data);
        setTransactions(data);
      } else {
        console.error("Failed to fetch transaction data.");
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  });

  const fetchCategories = useRef(async () => {
    try {
      const response = await fetch("/api/categories", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Inbound Categories:", data);
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching inbound categories:", error);
    }
  });

  const fetchCreditCards = useRef(async () => {
    try {
      const response = await fetch("/api/credit-cards");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Credit Cards:", data);
        setCreditCards(data);
      }
    } catch (error) {
      console.error("Error fetching credit cards:", error);
    }
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form Data to Submit:", formData);

    fetch("/api/transactions", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Transaction data submitted successfully!");
          setFormData({
            description: "",
            value: 0,
            action: null,
            date: today,
            category: null,
            payment: null,
            creditcard: null,
          });
        } else {
          console.error("Failed to submit transaction data.");
        }
      })
      .finally(() => {
        console.log("Submission attempt completed.");
        fetchTransactionData.current();
      });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    if (name === "value") {
      let value = e.target.value.replace(/\D/g, "");
      const numberValue = Number(value) / 100;

      e.target.value = numberValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      setFormData((prev: any) => ({ ...prev, [name]: numberValue }));
      return;
    }

    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (id: number) => {
    fetch(`/api/transactions?id=${id}`, {
      credentials: "include",
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
    today,
    formData,
    openCardId,
    categories,
    creditCards,
    transactions,
    setFormData,
    handleSubmit,
    handleChange,
    handleDelete,
    setOpenCardId,
  };
}
