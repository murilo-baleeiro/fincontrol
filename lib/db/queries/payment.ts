import { db } from "../connections";
import { RowDataPacket } from "mysql2/promise";

interface Payment extends RowDataPacket {
  id: number;
  name: string;
  created_at: Date;
}

export async function getPaymentsMethods(): Promise<Payment[]> {
  const [rows] = await db.query<Payment[]>(`SELECT * FROM payments ORDER BY id ASC`);
  return rows;
}

export async function createPaymentMethod(data: { name: string }) {
  const { name } = data;
  const [result] = await db.execute(`INSERT INTO payments (name) VALUES (?)`, [name]);
  return result;
}

export async function deletePaymentMethod(id: number) {
  const [result] = await db.execute(`DELETE FROM payments WHERE id = ?`, [id]);
  return result;
}
