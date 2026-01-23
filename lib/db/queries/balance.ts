import { RowDataPacket } from "mysql2";
import { db } from "../connections";

interface BalanceRow extends RowDataPacket {
  inbound: number;
  outbound: number;
}

export async function getTotalBalance(month?: number, year?: number): Promise<number> {
  let query = `
    SELECT
      COALESCE(SUM(CASE WHEN action = 'inbound' THEN value ELSE 0 END), 0) AS inbound,
      COALESCE(SUM(CASE WHEN action = 'outbound' THEN value ELSE 0 END), 0) AS outbound
    FROM transactions
  `;

  const params: number[] = [];

  if (month !== undefined && year !== undefined) {
    query += ` WHERE MONTH(date) = ? AND YEAR(date) = ?`;
    params.push(month + 1, year);
  }

  const [rows] = await db.query<BalanceRow[]>(query, params);

  const { inbound, outbound } = rows[0];
  return inbound - outbound;
}
