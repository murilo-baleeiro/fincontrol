import { getCreditCards, getCreditCardSpent } from "@/lib/db/queries/credit-cards";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const creditCards = await getCreditCards();

    const cardsWithUsage = await Promise.all(
      creditCards.map(async (card) => ({
        ...card,
        spent: await getCreditCardSpent(card.id),
      })),
    );

    return NextResponse.json(cardsWithUsage, { status: 200 });
  } catch (error) {
    console.error("GET /api/credit-cards/usage error:", error);
    return NextResponse.json({ message: "Erro ao buscar uso dos cartões de crédito." }, { status: 500 });
  }
}
