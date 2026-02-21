import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface MonthsCarouselProps {
  initialMonth?: number;
  onChange?: (value: number) => void;
}

export default function MonthsCarousel({ initialMonth, onChange }: MonthsCarouselProps) {
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth() || initialMonth || 0);
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  function getCurrentMonth() {
    const today = new Date();
    const currentMonth = today.getMonth();
    return currentMonth;
  }

  function handleIncreaseMonth() {
    const newMonth = (currentMonth + 1) % 12;
    setCurrentMonth(newMonth);
    onChange && onChange(newMonth);
  }

  function handleDecreaseMonth() {
    const newMonth = (currentMonth - 1 + 12) % 12;
    setCurrentMonth(newMonth);
    onChange && onChange(newMonth);
  }

  return (
    <div className="absolute top-2 left-0 w-full flex flex-row justify-between items-center border-b border-gray-200 pb-2 bg-white">
      <button className="p-2" onClick={handleDecreaseMonth}>
        <ChevronLeft strokeWidth={1.25} />
      </button>
      <h1 className="text-lg">{months[currentMonth]}</h1>
      <button className="p-2" onClick={handleIncreaseMonth}>
        <ChevronRight strokeWidth={1.25} />
      </button>
    </div>
  );
}