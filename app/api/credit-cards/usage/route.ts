import { getCreditCards, getCreditCardSpent } from "@/lib/db/queries/credit-cards";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const monthNum = month ? parseInt(month) : undefined;
    const yearNum = year ? parseInt(year) : undefined;

    const creditCards = await getCreditCards();

    const cardsWithUsage = await Promise.all(
      creditCards.map(async (card) => ({
        ...card,
        spent: await getCreditCardSpent(card.id, monthNum, yearNum),
      })),
    );

    return NextResponse.json(cardsWithUsage, { status: 200 });
  } catch (error) {
    console.error("GET /api/credit-cards/usage error:", error);
    return NextResponse.json({ message: "Erro ao buscar uso dos cartões de crédito." }, { status: 500 });
  }
}
