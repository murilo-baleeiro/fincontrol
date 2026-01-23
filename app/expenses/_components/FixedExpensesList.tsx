"use client";

import FixedExpenseCard from "./FixedExpenseCard";

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

interface FixedExpensesListProps {
  expenses: FixedExpense[];
  loading: boolean;
  openCardId: number | null;
  onOpen: (id: number) => void;
  onClose: () => void;
  onDelete: (id: number) => void;
  onEdit: (expense: FixedExpense) => void;
  onToggleActive: (id: number, isActive: boolean) => void;
  isLoadingToggle?: boolean;
}

export default function FixedExpensesList({ expenses, loading, openCardId, onOpen, onClose, onDelete, onEdit, onToggleActive, isLoadingToggle = false }: FixedExpensesListProps) {
  if (loading) {
    return <p className="w-full text-center text-sm text-gray-500 mt-2">Carregando...</p>;
  }

  if (expenses.length === 0) {
    return <p className="w-full text-center text-sm text-gray-500 mt-4">Nenhuma despesa fixa cadastrada.</p>;
  }

  return (
    <section className="mt-4 space-y-4 overflow-y-scroll h-[80vh] pb-28">
      <ul className="flex flex-col gap-4">
        {expenses.map((expense) => (
          <FixedExpenseCard
            key={expense.id}
            expense={expense}
            isOpen={openCardId === expense.id}
            onOpen={onOpen}
            onClose={onClose}
            onDelete={onDelete}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
            isLoadingToggle={isLoadingToggle}
          />
        ))}
      </ul>
    </section>
  );
}
