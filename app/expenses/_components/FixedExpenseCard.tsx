"use client";

import { Trash2, Edit, Info } from "lucide-react";
import { useState, useEffect } from "react";

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

interface FixedExpenseCardProps {
  expense: FixedExpense;
  isOpen: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
  onDelete: (id: number) => void;
  onEdit: (expense: FixedExpense) => void;
  onToggleActive: (id: number, isActive: boolean) => void;
  isLoadingToggle?: boolean;
}

export default function FixedExpenseCard({ expense, isOpen, onOpen, onClose, onDelete, onEdit, onToggleActive, isLoadingToggle = false }: FixedExpenseCardProps) {
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    setTranslateX(isOpen ? -80 : 0);
  }, [isOpen]);

  function handleTouchStart(e: React.TouchEvent) {
    setStartX(e.touches[0].clientX);
  }

  function handleTouchMove(e: React.TouchEvent) {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    if (diff < 0) {
      setTranslateX(Math.max(diff, -80));
      onOpen(expense.id);
    }

    if (diff > 20) {
      onClose();
    }
  }

  function handleTouchEnd() {
    if (translateX < -40) {
      onOpen(expense.id);
    } else {
      onClose();
    }
  }

  return (
    <div className={`relative border rounded overflow-hidden transition-opacity ${expense.is_active ? "bg-white border-gray-200" : "bg-gray-100 border-gray-300 opacity-60"}`}>
      <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center rounded-e bg-red-500">
        <button onClick={() => onDelete(expense.id)} disabled={isLoadingToggle} className="disabled:opacity-50">
          <Trash2 className="text-white" size={20} />
        </button>
      </div>

      <div
        className="p-4 flex items-center gap-4 bg-inherit transition-transform duration-75"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <label className="relative inline-flex items-center">
          <input type="checkbox" checked={expense.is_active} onChange={() => onToggleActive(expense.id, !expense.is_active)} disabled={isLoadingToggle} className="sr-only peer" />
          <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 disabled:opacity-50" />
        </label>

        <div className="w-full flex justify-between items-center overflow-hidden">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-sm">{expense.description}</p>
            <p className="text-xs text-gray-500 mt-1">Vencimento: dia {expense.due_day}</p>
            <p className="text-xs text-gray-500">{expense.category_name}</p>
            <p className="text-xs text-gray-500">{expense.payment_name}</p>
            {expense.credit_card_name && <p className="text-xs text-blue-600 font-semibold">Cartão: {expense.credit_card_name}</p>}
          </div>

          <div className="flex flex-col items-end gap-2 ml-4">
            <p className="font-bold text-green-600 whitespace-nowrap">
              R$
              {expense.value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
