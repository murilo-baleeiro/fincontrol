import { getTopExpensesByCategory } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getTopExpensesByCategory(5);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar maiores gastos:", error);
    return NextResponse.json({ message: "Erro ao buscar maiores gastos por tipo" }, { status: 500 });
  }
}
