import { getTopExpensesByCategory } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const monthNum = month ? parseInt(month) : undefined;
    const yearNum = year ? parseInt(year) : undefined;

    const data = await getTopExpensesByCategory(5, monthNum, yearNum);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar maiores gastos:", error);
    return NextResponse.json({ message: "Erro ao buscar maiores gastos por tipo" }, { status: 500 });
  }
}
