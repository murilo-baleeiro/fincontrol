import { RowDataPacket } from "mysql2";
import { db } from "../connections";

interface BalanceRow extends RowDataPacket {
  inbound: number;
  outbound: number;
}

export async function getTotalBalance(): Promise<number> {
  const [rows] = await db.query<BalanceRow[]>(`
    SELECT
      COALESCE(SUM(CASE WHEN action = 'inbound' THEN value ELSE 0 END), 0) AS inbound,
      COALESCE(SUM(CASE WHEN action = 'outbound' THEN value ELSE 0 END), 0) AS outbound
    FROM transactions
  `);

  const { inbound, outbound } = rows[0];
  return inbound - outbound;
}
