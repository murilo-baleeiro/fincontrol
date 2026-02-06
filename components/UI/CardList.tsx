"use client";

import { ReactNode } from "react";

interface CardListProps {
  children: ReactNode;
  switchMode?: true;
  onSwitch?: (checked: boolean) => void;
}

export default function CardList({ children, switchMode, onSwitch }: CardListProps) {
  return (
    <li className="border border-gray-200 shadow-md rounded-md flex items-center p-4 gap-4" key={Math.random()}>
      {switchMode && (
        <label className="relative">
          <input type="checkbox" className="hidden peer" onChange={(e) => onSwitch?.(e.target.checked)} />
          <div className="w-9 h-5 bg-gray-200 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-green-400 peer-checked:border-green-400"></div>
        </label>
      )}
      {children}
    </li>
  );
}
