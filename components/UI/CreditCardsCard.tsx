"use client";

import { CreditsCards } from "@/@types";
import { formatCurrencyDisplay } from "@/utils";
import { Trash2, CreditCard, Pencil } from "lucide-react";
import { useState, useEffect } from "react";

interface TransactionCardProps {
  creditCardData: CreditsCards;
  isOpen: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
  onDelete: (id: number) => void;
  onEdit: (card: CreditsCards) => void;
}

export default function TransactionCard({ creditCardData, isOpen, onOpen, onClose, onDelete, onEdit }: TransactionCardProps) {
  const { id, name, card_limit, due_day, close_day } = creditCardData;
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    setTranslateX(isOpen ? -160 : 0);
  }, [isOpen]);

  function handleTouchStart(e: React.TouchEvent) {
    setStartX(e.touches[0].clientX);
  }

  function handleTouchMove(e: React.TouchEvent) {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    if (diff < 0) {
      setTranslateX(Math.max(diff, -160));
      onOpen(id);
    }

    if (diff > 20) {
      onClose();
    }
  }

  function handleTouchEnd() {
    if (translateX < -80) {
      onOpen(id);
    } else {
      onClose();
    }
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-40 flex rounded-e">
        <button onClick={() => onEdit(creditCardData)} className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 transition-colors">
          <Pencil className="text-white" size={20} />
        </button>
        <button onClick={() => onDelete(id)} className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors">
          <Trash2 className="text-white" size={20} />
        </button>
      </div>

      <div
        className="p-4 flex items-center gap-4 bg-white transition-transform duration-75"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full flex justify-start items-center gap-4 overflow-hidden">
          <CreditCard size={28} strokeWidth={1.5} className="w-14 text-blue-500" />
          <div className="flex flex-col">
            <span className="font-semibold">{name}</span>
            <span className="font-light">Limite: {formatCurrencyDisplay(card_limit)}</span>
            <span className="text-xs text-gray-400">
              Vencimento: {due_day} | Fechamento: {close_day}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
