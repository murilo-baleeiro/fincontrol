"use client";

import { Trash2, CircleArrowDown, CircleArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

interface TransactionCardProps {
  id: number;
  action: "inbound" | "outbound";
  title: string;
  date: string;
  value: number;
  isOpen: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export default function TransactionCard({ id, action, title, date, value, isOpen, onOpen, onClose, onDelete }: TransactionCardProps) {
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    setTranslateX(isOpen ? -80 : 0);
  }, [isOpen]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString("pt-BR", {
      month: "short",
    });

    return `${day} de ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  }

  function handleTouchStart(e: React.TouchEvent) {
    setStartX(e.touches[0].clientX);
  }

  function handleTouchMove(e: React.TouchEvent) {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    if (diff < 0) {
      setTranslateX(Math.max(diff, -80));
      onOpen(id);
    }

    if (diff > 20) {
      onClose();
    }
  }

  function handleTouchEnd() {
    if (translateX < -40) {
      onOpen(id);
    } else {
      onClose();
    }
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center rounded-e">
        <button onClick={() => onDelete(id)}>
          <Trash2 className="text-white" />
        </button>
      </div>

      <div
        className="p-4 flex items-center gap-4 bg-white transition-transform duration-75"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {action === "inbound" ? <CircleArrowDown size={36} className="text-emerald-500" /> : <CircleArrowUp size={36} className="text-red-500" />}

        <div className="w-full flex justify-between items-center">
          <div>
            <p>{title}</p>
            <p className="text-xs text-gray-500">{formatDate(date)}</p>
          </div>

          <p className={`font-semibold ${action === "outbound" ? "text-red-500" : "text-emerald-500"}`}>
            {action === "outbound" ? "-" : "+"}R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(".", ",")}
          </p>
        </div>
      </div>
    </div>
  );
}
