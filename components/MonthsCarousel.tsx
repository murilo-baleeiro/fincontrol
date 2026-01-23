import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function MonthsCarousel() {

    function getCurrentMonth() {
        const today = new Date();
        const currentMonth = today.getMonth();
        return currentMonth;
    }

    const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <div className="flex flex-row justify-between items-center border-b border-gray-200 pb-4">
            <button className="p-2" onClick={() => setCurrentMonth((currentMonth - 1 + 12) % 12)}>
                <ChevronLeft strokeWidth={1.25} />
            </button>
            <h1 className="text-lg">{months[currentMonth]}</h1>
            <button className="p-2" onClick={() => setCurrentMonth((currentMonth + 1) % 12)}>
                <ChevronRight strokeWidth={1.25} />
            </button>
        </div>
    );
}