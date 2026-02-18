"use client";

import { CircleArrowDown, CircleArrowUp, Trash2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import SwitchBox from "./SwitchBox";

interface CardListProps {
  id: number;
  children: ReactNode;
  action?: "inbound" | "outbound";
  switchMode?: true;
  initialChecked?: boolean;
  isOpen: boolean;
  onSwitch?: (checked: boolean) => void;
  onOpen: (id: number) => void;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export default function CardItem({ id, children, action, isOpen, onOpen, onClose, onDelete }: CardListProps) {
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
      onOpen(id);
    }

    if (diff > 40) {
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
    <li className="relative border border-gray-200 shadow-md rounded flex items-center gap-4 bg-white overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-20 flex rounded-e">
        <button onClick={() => onDelete(id)} className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors">
          <Trash2 className="text-white" size={20} />
        </button>
      </div>
      <div
        className="w-full flex justify-start items-center gap-4 overflow-hidden bg-white p-4 transition-transform duration-75"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {action === "inbound" && <CircleArrowDown className="text-green-500 mx-2" size={36} strokeWidth={1.25} />}
        {action === "outbound" && <CircleArrowUp className="text-red-500 mx-2" size={36} strokeWidth={1.25} />}
        <div className="w-full h-full">{children}</div>
      </div>
    </li>
  );
}
