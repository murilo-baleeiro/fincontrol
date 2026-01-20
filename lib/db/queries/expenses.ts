import { RowDataPacket } from "mysql2";
import { db } from "../connections";

interface ExpensesRow extends RowDataPacket {
  expenses: number;
}

export async function getTotalExpenses(): Promise<number> {
  const [rows] = await db.query<ExpensesRow[]>(`
    SELECT
      COALESCE(SUM(CASE WHEN action = 'outbound' THEN value ELSE 0 END), 0) AS expenses
    FROM transactions
  `);

  const { expenses } = rows[0];
  return expenses;
}
