import { RowDataPacket } from "mysql2";
import { db } from "../connections";

interface ExpensesRow extends RowDataPacket {
  expenses: number;
}

interface TopExpensesRow extends RowDataPacket {
  category: string;
  value: number;
}

export async function getTotalExpenses(month?: number, year?: number): Promise<number> {
  let query = `
    SELECT
      COALESCE(SUM(CASE WHEN action = 'outbound' THEN value ELSE 0 END), 0) AS expenses
    FROM transactions
  `;

  const params: number[] = [];

  if (month !== undefined && year !== undefined) {
    query += ` WHERE MONTH(date) = ? AND YEAR(date) = ?`;
    params.push(month + 1, year);
  }

  const [rows] = await db.query<ExpensesRow[]>(query, params);

  const { expenses } = rows[0];
  return Number(expenses);
}

export async function getTopExpensesByCategory(limit: number = 5, month?: number, year?: number): Promise<{ category: string; total: number }[]> {
  let query = `
    SELECT
      C.name AS category,
      SUM(T.value) AS value
    FROM transactions T
    INNER JOIN categories C ON C.id = T.category_id
    WHERE T.action = 'outbound'
  `;

  const params: (number | string)[] = [];

  if (month !== undefined && year !== undefined) {
    query += ` AND MONTH(T.date) = ? AND YEAR(T.date) = ?`;
    params.push(month + 1, year);
  }

  query += ` GROUP BY C.name ORDER BY value DESC LIMIT ?;`;
  params.push(limit);

  const [rows] = await db.query<TopExpensesRow[]>(query, params);
  return rows.map((row) => ({
    category: row.category,
    total: Number(row.value),
  }));
}
