import { NextResponse, NextRequest } from "next/server";
import { getTotalExpenses } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const monthNum = month ? parseInt(month) : undefined;
    const yearNum = year ? parseInt(year) : undefined;

    const expenses = await getTotalExpenses(monthNum, yearNum);
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
