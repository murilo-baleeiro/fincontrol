"use client";

import { useEffect, useState } from "react";
import { CircleArrowUp, CircleArrowDown } from "lucide-react";
import TransactionCard from "./_components/TransactionCard";
import TransactionForm from "./_components/TransactionForm";

interface Transaction {
  id: number;
  action: "inbound" | "outbound";
  description: string;
  value: number;
  date: string;
}

export default function Transactions() {
  const [action, setAction] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  async function fetchTransactions() {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleActiveForm = (action: string) => {
    setAction(action);
    setShowForm(true);
  };

  const handleOpenCard = (id: number) => {
    setOpenCardId(id);
  };

  const handleCloseCard = () => {
    setOpenCardId(null);
  };

  async function handleDeleteTransaction(id: number) {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
    setOpenCardId(null);
  }

  return (
    <main className="px-4">
      <div className="w-full mt-4 flex flex-row gap-4 justify-around">
        <button
          className="h-10 flex-1 bg-red-400 text-white rounded-md flex flex-row justify-center items-center gap-2 focus:ring-2 focus:ring-red-400 focus:outline"
          onClick={() => handleActiveForm("outbound")}
        >
          <CircleArrowUp strokeWidth={1.5} size={20} />
          <span>Despesa</span>
        </button>
        <button
          className="flex-1 bg-emerald-400 text-white rounded-md flex flex-row justify-center items-center gap-2 focus:ring-2 focus:ring-emerald-400 focus:outline"
          onClick={() => handleActiveForm("inbound")}
        >
          <CircleArrowDown strokeWidth={1.5} size={20} />
          <span>Receita</span>
        </button>
      </div>
      {showForm && <TransactionForm action={action} onClose={handleCloseForm} onSuccess={fetchTransactions} />}
      <section className="mt-4 space-y-4 overflow-y-scroll h-[80vh] pb-28">
        {transactions.map((t) => (
          <TransactionCard
            key={t.id}
            id={t.id}
            action={t.action}
            title={t.description}
            date={t.date}
            value={t.value}
            isOpen={openCardId === t.id}
            onOpen={handleOpenCard}
            onClose={handleCloseCard}
            onDelete={handleDeleteTransaction}
          />
        ))}
      </section>
    </main>
  );
}
