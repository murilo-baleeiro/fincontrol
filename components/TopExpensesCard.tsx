import { formatCurrencyDisplay } from "@/utils";

export default function TopExpensesCard({topExpenses}: {topExpenses: { category: string; total: number }[]}) {
    const maxValueTopExpenses = Math.max(...topExpenses.map((e) => e.total));

    return(
        <div className="w-full rounded-lg bg-amber-500 p-4 text-white shadow-md">
        <h2 className="text-sm font-light">Maiores Gastos por Tipo:</h2>
        <div className="mt-4 space-y-3">
          {topExpenses.length > 0 ? (
            topExpenses.map((expense) => (
              <div key={expense.category}>
                <div className="flex items-center justify-between text-sm">
                  <span>{expense.category}</span>
                  <span className="font-semibold">{formatCurrencyDisplay(expense.total)}</span>
                </div>

                <div className="mt-1 h-2 w-full rounded-full bg-white/30">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{
                      width: `${(expense.total / maxValueTopExpenses) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm font-light text-orange-100">Nenhum gasto categorizado registrado.</div>
          )} 
        </div>
      </div>
    );
}