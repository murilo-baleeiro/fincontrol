"use client";

import { useEffect, useState } from "react";
import { CircleArrowUp, CircleArrowDown } from "lucide-react";

import TransactionForm from "./_components/TransactionForm";
import TransactionCard from "../../components/UI/TransactionCard";
import TransactionCardSkeleton from "../../components/UI/TransactionCardSkeleton";

interface Transaction {
  id: number;
  action: "inbound" | "outbound";
  description: string;
  value: number;
  date: string;
}

export default function Transactions() {
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [limit, setLimit] = useState<number>(15);

  async function fetchTransactions(limit: number) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/transactions?limit=${limit}`);
      if (!res.ok) {
        throw new Error("Erro ao buscar transações");
      }
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as transações.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions(limit);
  }, [limit]);

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
        fetchTransactions(limit);
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
      {showForm && <TransactionForm action={action} onClose={handleCloseForm} onSuccess={() => fetchTransactions(limit)} />}
      <section className="mt-4 space-y-4 overflow-y-scroll h-[80vh] pb-28">
        {loading && Array.from({ length: 6 }).map((_, index) => <TransactionCardSkeleton key={index} />)}
        {!loading && error && <p className="text-center text-sm text-red-500">{error}</p>}
        {!loading && !error && transactions.length === 0 && <p className="text-center text-sm text-gray-500">Nenhuma transação encontrada.</p>}
        {!loading &&
          !error &&
          transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              isOpen={openCardId === transaction.id}
              onOpen={handleOpenCard}
              onClose={handleCloseCard}
              onDelete={handleDeleteTransaction}
            />
          ))}
        {transactions.length > 0 && (
          <button className="w-full py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors" onClick={() => setLimit(limit + 15)}>
            Ver mais
          </button>
        )}
      </section>
    </main>
  );
}
