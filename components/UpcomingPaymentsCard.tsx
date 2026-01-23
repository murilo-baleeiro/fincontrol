import { formatCurrencyDisplay } from "@/utils";

interface FixedExpense {
  id: number;
  description: string;
  value: number;
  due_day: number;
  category_id: number;
  payment_id: number;
  credit_card_id?: number | null;
  is_active: boolean;
  category_name?: string;
  payment_name?: string;
  credit_card_name?: string;
}

interface UpcomingPaymentsCardProps {
  upcomingPayments: FixedExpense[];
  isLoading?: boolean;
}

export default function UpcomingPaymentsCard({ upcomingPayments, isLoading = false }: UpcomingPaymentsCardProps) {
  const today = new Date();
  const currentDay = today.getDate();

  const getDayLabel = (dueDay: number) => {
    if (dueDay === currentDay) return "Vence hoje";
    if (dueDay === currentDay + 1) return "Vence amanhã";
    return `Vence em ${dueDay - currentDay} dias`;
  };

  return (
    <div className="w-full rounded-lg bg-green-600 p-4 text-white shadow-md">
      <h2 className="text-sm font-light">Próximos Pagamentos (7 dias):</h2>
      <div className="mt-4 space-y-3">
        {upcomingPayments.length > 0 ? (
          upcomingPayments.map((payment) => (
            <div key={payment.id} className={`rounded-md p-3 ${payment.is_active ? "bg-green-700" : "bg-green-900/50 opacity-60"}`}>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center justify-start gap-1">
                    <span className="font-semibold text-sm">{payment.description}</span>
                    <span className="text-green-100 text-sm">- {payment.category_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-light text-green-100">Pagamento em {payment.payment_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-200">{getDayLabel(payment.due_day)}</span>
                    <span className="font-semibold">{formatCurrencyDisplay(payment.value)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm font-light text-green-100">Nenhum pagamento nos próximos 7 dias.</div>
        )}
      </div>
    </div>
  );
}
