import { RowDataPacket } from "mysql2";
import { db } from "../connections";

interface ExpensesRow extends RowDataPacket {
  expenses: number;
}

interface TopExpensesRow extends RowDataPacket {
  category: string;
  value: number;
}

export async function getTotalExpenses(): Promise<number> {
  const [rows] = await db.query<ExpensesRow[]>(`
    SELECT
      COALESCE(SUM(CASE WHEN action = 'outbound' THEN value ELSE 0 END), 0) AS expenses
    FROM transactions
  `);

  const { expenses } = rows[0];
  return Number(expenses);
}

export async function getTopExpensesByCategory(limit: number = 5): Promise<{ category: string; total: number }[]> {
  const [rows] = await db.query<TopExpensesRow[]>(
    `
    SELECT
      C.name AS category,
      SUM(T.value) AS value
    FROM transactions T
    INNER JOIN categories C ON C.id = T.id_category
    GROUP BY c.name
    ORDER BY value DESC
    LIMIT ?
  `,
    [limit],
  );
  return rows.map((row) => ({
    category: row.category,
    total: Number(row.value),
  }));
}
