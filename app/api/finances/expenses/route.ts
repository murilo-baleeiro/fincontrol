import { NextResponse } from "next/server";
import { getTotalExpenses } from "@/lib/db";

export async function GET() {
  try {
    const expenses = await getTotalExpenses();
    return NextResponse.json(
      { expenses },
      {
        status: 200,
        headers: {
          // cache compartilhado
          "Cache-Control": "s-maxage=60, stale-while-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("Erro ao calcular gastos:", error);
    return NextResponse.json({ message: "Erro ao calcular gastos" }, { status: 500 });
  }
}
