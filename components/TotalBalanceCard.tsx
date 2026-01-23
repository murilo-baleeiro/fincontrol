import { formatCurrencyDisplay } from "@/utils";
import { twMerge } from "tailwind-merge";

export default function TotalBalanceCard({balance}: {balance: number}) {
  return (
    <div
      className={twMerge(
        "w-full h-24 flex flex-col justify-center items-start gap-2 pl-4 bg-blue-500 text-white rounded-lg shadow-md",
        balance < 0 && "bg-red-500 animate-pulse outline-2 outline-red-500 border border-white",
      )}
    >
      <p className="text-sm font-light">Ativos Totais:</p>
      <p className="text-2xl font-bold">{formatCurrencyDisplay(balance)}</p>
    </div>
  );
}
