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
  const [rows] = await db.query<Transaction[]>("SELECT * FROM transactions ORDER BY created_at DESC");
  return rows;
}

export async function createTransaction(data: { action: "inbound" | "outbound"; description: string; value: number; date: string }) {
  const { action, description, value, date } = data;

  const [result] = await db.execute(
    `INSERT INTO transactions (action, description, value, date)
     VALUES (?, ?, ?, ?)`,
    [action, description, value, date],
  );

  return result;
}

export async function deleteTransaction(id: number) {
  const [result] = await db.execute(`DELETE FROM transactions WHERE id = ?`, [id]);
  return result;
}
