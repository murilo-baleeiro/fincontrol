import { NextResponse, NextRequest } from "next/server";
import { getTotalBalance, getTotalExpenses } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const monthNum = month ? parseInt(month) : undefined;
    const yearNum = year ? parseInt(year) : undefined;

    const balance = await getTotalBalance(monthNum, yearNum);
    return NextResponse.json(
      { balance },
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
