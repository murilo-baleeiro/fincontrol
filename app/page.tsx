"use client";

import { usePathname } from "next/navigation";

import { monetaryFormatting } from "@/utils";
import ColorCard from "@/components/UI/ColorCard";
import MonthsSlider from "@/components/MonthsSlider";
import DonutChart from "@/components/UI/DonutChart";
import useHome from "./_useHome";

export default function Home() {
  const { balance, expenses, expensesByCategory, creditCardsUsage, month, handleMonthChange } = useHome();

  return (
    <main className={`overflow-auto pb-20 pt-12 flex flex-col gap-4 ${usePathname() === "/" && "pt-15"}`}>
      <MonthsSlider initialMonth={month} onChange={handleMonthChange} />

      <div className="flex flex-row gap-4 items-center">
        <ColorCard color="blue">
          <p className="text-sm font-light">Ativos Totais:</p>
          <p className="text-2xl font-bold">{monetaryFormatting(balance)}</p>
        </ColorCard>
        <ColorCard color="purple">
          <p className="text-sm font-light">Gastos do Mês:</p>
          <p className="text-2xl font-bold">{monetaryFormatting(expenses)}</p>
        </ColorCard>
      </div>

      <ColorCard color="orange">
        <p className="text-sm font-light">Uso dos Cartões:</p>
        <div className="w-full pr-4 mt-4 space-y-3 flex flex-col gap-2">
          {creditCardsUsage.length > 0 ? (
            creditCardsUsage.map(({ creditcard_id, creditcard_name, creditcard_usage, creditcard_limit }) => (
              <div key={creditcard_id} className="">
                <p className="font-normal border-b border-white/30 pb-1">{creditcard_name}</p>
                <div className="flex items-center justify-between text-sm pt-1.5">
                  <p className="font-light">
                    Utilizado:<strong className="font-semibold"> {monetaryFormatting(creditcard_usage)}</strong>
                  </p>
                  <p className="font-light">
                    Limite: <strong className="font-semibold">{monetaryFormatting(creditcard_limit)}</strong>
                  </p>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-white/30">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{
                      width: `${(creditcard_usage / creditcard_limit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm font-light text-red-100">Nenhum cartão de crédito cadastrado.</div>
          )}
        </div>
      </ColorCard>

      <ColorCard color="gray">
        <p className="text-sm font-light">Maiores Gastos por Categoria:</p>
        <div className="w-full pr-4 mt-4">
          <DonutChart data={expensesByCategory} title="Gastos" />
        </div>
      </ColorCard>
    </main>
  );
}
