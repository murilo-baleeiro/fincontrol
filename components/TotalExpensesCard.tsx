import { formatCurrencyDisplay } from "@/utils";

export default function TotalExpensesCard({expenses}: {expenses: number}) {
    return(
        <div className="w-full h-22 flex flex-col justify-center items-start gap-2 pl-4 bg-fuchsia-600 text-white rounded-lg shadow-md">
          <p className="text-sm font-light">Gastos Totais do Mês:</p>
          <p className="text-2xl font-bold">{formatCurrencyDisplay(expenses)}</p>
        </div>
    );
}