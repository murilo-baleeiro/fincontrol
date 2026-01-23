"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import FixedExpenseForm from "./_components/FixedExpenseForm";
import FixedExpensesList from "./_components/FixedExpensesList";

interface FixedExpense {
  id: number;
  description: string;
  value: number;
  due_day: number;
  category_id: number;
  payment_id: number;
  is_active: boolean;
  category_name?: string;
  payment_name?: string;
}

export default function Expenses() {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [editingExpense, setEditingExpense] = useState<FixedExpense | null>(null);
  const [isLoadingToggle, setIsLoadingToggle] = useState(false);

  useEffect(() => {
    fetchFixedExpenses();
  }, []);

  async function fetchFixedExpenses() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/fixed-expenses");
      if (!response.ok) throw new Error();

      const data = await response.json();
      setFixedExpenses(Array.isArray(data) ? data : []);
    } catch {
      setError("Erro ao carregar despesas fixas.");
      setFixedExpenses([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteExpense(id: number) {
    try {
      const response = await fetch("/api/fixed-expenses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error();
      fetchFixedExpenses();
    } catch {
      setError("Erro ao deletar despesa fixa.");
    } finally {
      setOpenCardId(null);
    }
  }

  async function handleToggleActive(id: number, isActive: boolean) {
    try {
      setIsLoadingToggle(true);
      const response = await fetch("/api/fixed-expenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: isActive }),
      });

      if (!response.ok) throw new Error();
      await fetchFixedExpenses();
      setOpenCardId(null);
    } catch {
      setError("Erro ao atualizar despesa fixa.");
    } finally {
      setIsLoadingToggle(false);
    }
  }

  const handleOpenCard = (id: number) => {
    setOpenCardId(id);
  };

  const handleCloseCard = () => {
    setOpenCardId(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleEditExpense = (expense: FixedExpense) => {
    setEditingExpense(expense);
    setShowForm(true);
    setOpenCardId(null);
  };

  return (
    <main className="px-4">
      {!showForm && (
        <div className="w-full mt-4 flex justify-center">
          <button
            className="h-10 flex-1 bg-green-600 text-white rounded-md flex flex-row justify-center items-center gap-2 focus:ring-2 focus:ring-green-400 focus:outline"
            onClick={() => setShowForm(true)}
          >
            <Plus strokeWidth={1.5} size={20} />
            <span>Adicionar Despesa Fixa</span>
          </button>
        </div>
      )}

      {showForm && <FixedExpenseForm editingExpense={editingExpense} onClose={handleCloseForm} onSuccess={fetchFixedExpenses} />}

      {error && <p className="w-full text-center text-sm text-red-500 mt-2">{error}</p>}

      <FixedExpensesList
        expenses={fixedExpenses}
        loading={loading}
        openCardId={openCardId}
        onOpen={handleOpenCard}
        onClose={handleCloseCard}
        onDelete={handleDeleteExpense}
        onEdit={handleEditExpense}
        onToggleActive={handleToggleActive}
        isLoadingToggle={isLoadingToggle}
      />
    </main>
  );
}
