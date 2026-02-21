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
    const [rows] = await db.query<RowDataPacket[]>(`
    SELECT
      COALESCE(SUM(CASE WHEN action = 'inbound' THEN value ELSE 0 END), 0) AS total_inbound,
      COALESCE(SUM(CASE WHEN action = 'outbound' THEN value ELSE 0 END), 0) AS total_outbound
    FROM transactions
    WHERE MONTH(date) = ? AND YEAR(date) = ?
  `, [parseInt(month), parseInt(year)]);

    const { total_inbound, total_outbound } = rows[0];
    const total_balance = total_inbound - total_outbound;

    return new Response(JSON.stringify({ total_inbound, total_outbound, total_balance }), { status: 200 });
  } catch (error: any) {
    return new Response(`Erro ao buscar o saldo. ${error.message}`, { status: 500 });
  }
}
