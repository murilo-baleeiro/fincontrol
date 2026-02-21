import { db } from "@/lib";
import { RowDataPacket } from "mysql2";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  if (!month || !year) {
    return new Response("Parâmetros 'month' e 'year' são obrigatórios.", {
      status: 400,
    });
  }

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT
        c.id AS creditcard_id,
        c.name AS creditcard_name,
        COALESCE(SUM(t.value), 0) AS creditcard_usage,
        c.cardlimit AS creditcard_limit
      FROM creditcards c
      LEFT JOIN transactions t ON c.id = t.creditcard_id
        AND MONTH(t.date) = ?
        AND YEAR(t.date) = ?
      GROUP BY c.id, c.name, c.cardlimit
    `,
      [parseInt(month), parseInt(year)],
    );

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error: any) {
    return new Response(`Erro ao buscar uso de cartões de crédito. ${error.message}`, { status: 500 });
  }
}
