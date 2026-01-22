import { Transaction } from "@/@types/transaction";
import { db } from "../connections";
import { RowDataPacket } from "mysql2/promise";

export async function getTransactions(limit: number): Promise<Transaction[]> {
  const [rows] = await db.query<Transaction[]>(
    `
    SELECT
      T.id,
      T.description,
      T.value,
      T.action,
      T.date,
      T.category_id,
      T.payment_id,
      T.created_at
    FROM
      transactions T
    ORDER BY
      T.created_at DESC
    LIMIT ${Number(limit) || 1000}`,
  );
  return rows;
}

export async function createTransaction(data: { action: "inbound" | "outbound"; description: string; value: number; date: string; category?: number; payment?: number }) {
  const { action, description, value, date, category, payment } = data;

  const [result] = await db.execute(
    `INSERT INTO transactions (action, description, value, date, category_id, payment_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [action, description, value, date, category || null, payment || null],
  );

  return result;
}

export async function deleteTransaction(id: number) {
  const [result] = await db.execute(`DELETE FROM transactions WHERE id = ?`, [id]);
  return result;
}
