"use client";

import { Trash2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface CardListProps {
  id: number;
  children: ReactNode;
  switchMode?: true;
  initialChecked?: boolean;
  isOpen: boolean;
  onSwitch?: (checked: boolean) => void;
  onOpen: (id: number) => void;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export default function CardItem({ id, children, switchMode, initialChecked = true, isOpen, onSwitch, onOpen, onClose, onDelete }: CardListProps) {
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [checked, setChecked] = useState(initialChecked);

  useEffect(() => {
    setTranslateX(isOpen ? -80 : 0);
  }, [isOpen]);

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);

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
    <li className={`relative border border-gray-200 shadow-md rounded flex items-center gap-4 bg-white overflow-hidden ${checked ? "opacity-100" : "opacity-60"}`}>
      <div className="absolute inset-y-0 right-0 w-20 flex rounded-e">
        <button onClick={() => onDelete(id)} className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors">
          <Trash2 className="text-white" size={20} />
        </button>
      </div>
      <div className="w-full flex justify-start items-center gap-4 overflow-hidden bg-white p-4 transition-transform duration-75"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        {switchMode && (
          <label className="relative inline-flex items-center px-2">
            <input
              type="checkbox"
              className="hidden peer"
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
                onSwitch?.(e.target.checked);
              }}
            />
            <div className="w-9 h-5 bg-gray-200 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-2.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-green-400 peer-checked:border-green-400"></div>
          </label>
        )}
        <div className="w-full h-full">
          {children}
        </div>
      </div>

    </li>
  );
}
