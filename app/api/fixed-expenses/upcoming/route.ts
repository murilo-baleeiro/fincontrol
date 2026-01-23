import { NextResponse, NextRequest } from "next/server";
import { getUpcomingPayments } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const daysAhead = searchParams.get("days");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const daysAheadNum = daysAhead ? parseInt(daysAhead) : 7;
    const monthNum = month ? parseInt(month) : undefined;
    const yearNum = year ? parseInt(year) : undefined;

    const upcomingPayments = await getUpcomingPayments(daysAheadNum, monthNum, yearNum);

    return NextResponse.json(upcomingPayments, { status: 200 });
  } catch (error) {
    console.error("GET /api/fixed-expenses/upcoming error:", error);
    return NextResponse.json({ message: "Erro ao buscar despesas vencendo em breve." }, { status: 500 });
  }
}
