"use client";

import { CircleArrowUp, CircleArrowDown } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";
import TransactionCard from "./_components/TransactionCard";
import TransactionForm from "./_components/TransactionForm";

export default function Transactions() {
  const [showForm, setShowForm] = useState(false);
  const [action, setAction] = useState("");

  const handleCloseForm = () => setShowForm(false);

  const handleActiveForm = (action: string) => {
    setAction(action);
    setShowForm(true);
  };

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
      {showForm && <TransactionForm action={action} onClose={handleCloseForm} />}
      <section className="mt-4 space-y-4">
        <TransactionCard action="inbound" title="Salário" date="15 Nov. 2026" value={4000} />
        <TransactionCard action="outbound" title="Combustível" date="15 Nov. 2026" value={50} />
      </section>
    </main>
  );
}
