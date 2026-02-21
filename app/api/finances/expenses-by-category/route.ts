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
      c.name AS category,
    SUM(t.value) AS value
    FROM categories c
    INNER JOIN transactions t ON c.id = t.category_id
    WHERE MONTH(t.date) = ?
    AND YEAR(t.date) = ?
    AND t.action = 'outbound'
    GROUP BY c.name
    ORDER BY value DESC
    `,
      [parseInt(month), parseInt(year)],
    );
    const rowsWithColor = rows.map((row) => ({
      ...row,
      color: `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`,
    }));

    return new Response(JSON.stringify(rowsWithColor), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response("Erro ao buscar despesas por categoria.", {
      status: 500,
    });
  }
}
