import { NextResponse } from "next/server";
import { getPaymentsDueToday, checkIfTransactionExists, createTransaction } from "@/lib/db";

export async function GET() {
  try {
    const paymentsDueToday = await getPaymentsDueToday();

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Para cada despesa fixa que vence hoje, verificar e criar transação se não existir
    for (const payment of paymentsDueToday) {
      const transactionExists = await checkIfTransactionExists(payment.id, currentMonth, currentYear);

      if (!transactionExists) {
        await createTransaction({
          action: "outbound",
          description: payment.description,
          value: payment.value,
          date: today.toISOString().split("T")[0],
          category: payment.category_id,
          payment: payment.payment_id,
          fixedExpenseId: payment.id,
        });
      }
    }

    return NextResponse.json(paymentsDueToday, { status: 200 });
  } catch (error) {
    console.error("GET /api/fixed-expenses/due-today error:", error);
    return NextResponse.json({ message: "Erro ao buscar despesas vencendo hoje." }, { status: 500 });
  }
}
