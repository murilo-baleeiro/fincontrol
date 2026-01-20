import { NextResponse } from "next/server";
import { getTotalBalance, getTotalExpenses } from "@/lib/db";

export async function GET() {
  try {
    const [balance, expenses] = await Promise.all([getTotalBalance(), getTotalExpenses()]);
    return NextResponse.json(
      { balance, expenses },
      {
        status: 200,
        headers: {
          // cache compartilhado
          "Cache-Control": "s-maxage=60, stale-while-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("Erro ao calcular saldo:", error);
    return NextResponse.json({ message: "Erro ao calcular saldo" }, { status: 500 });
  }
}
