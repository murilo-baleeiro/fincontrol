import { db } from "../connections";
import { RowDataPacket } from "mysql2/promise";

export interface Transaction extends RowDataPacket {
  id: number;
  action: "inbound" | "outbound";
  description: string;
  value: number;
  date: string;
}

export async function getTransactions() {
  const [rows] = await db.query<Transaction[]>(`
    SELECT
      T.id,
      T.description,
      T.value,
      T.action,
      T.date,
      C.name category
    FROM
      transactions T
      LEFT JOIN categories C ON C.id = T.id_category
    ORDER BY
      T.created_at DESC`);
  return rows;
}

export async function createTransaction(data: { action: "inbound" | "outbound"; description: string; value: number; date: string; category?: number }) {
  const { action, description, value, date, category } = data;

  const [result] = await db.execute(
    `INSERT INTO transactions (action, description, value, date, id_category)
     VALUES (?, ?, ?, ?, ?)`,
    [action, description, value, date, category || null],
  );

  return result;
}

export async function deleteTransaction(id: number) {
  const [result] = await db.execute(`DELETE FROM transactions WHERE id = ?`, [id]);
  return result;
}
