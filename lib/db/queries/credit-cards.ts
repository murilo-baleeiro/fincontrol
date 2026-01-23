import { db } from "../connections";
import { RowDataPacket } from "mysql2/promise";

interface CreditCard extends RowDataPacket {
  id: number;
  name: string;
  card_limit: number;
  due_day: number;
  close_day: number;
  created_at: Date;
}

interface CreditCardUsage extends RowDataPacket {
  credit_card_id: number;
  total_spent: number;
}

export async function getCreditCards(): Promise<CreditCard[]> {
  const [rows] = await db.query<CreditCard[]>(`SELECT * FROM credit_cards ORDER BY id ASC`);
  return rows;
}

export async function getCreditCardSpent(creditCardId: number, month?: number, year?: number): Promise<number> {
  let query = `
        SELECT 
            cc.id as credit_card_id,
            COALESCE(SUM(t.value), 0) as total_spent
        FROM 
            credit_cards cc
        LEFT JOIN 
            transactions t ON cc.id = t.credit_card_id AND t.action = 'outbound'
        WHERE 
            cc.id = ?
  `;

  const params: number[] = [creditCardId];

  if (month !== undefined && year !== undefined) {
    query += ` AND MONTH(t.date) = ? AND YEAR(t.date) = ?`;
    params.push(month + 1, year);
  }

  query += ` GROUP BY cc.id`;

  const [rows] = await db.query<CreditCardUsage[]>(query, params);
  return rows.length > 0 ? rows[0].total_spent : 0;
}

export async function createCreditCard(data: { name: string; card_limit: number; due_day: number; close_day: number }) {
  const { name, card_limit, due_day, close_day } = data;
  const [result] = await db.execute(`INSERT INTO credit_cards (name, card_limit, due_day, close_day) VALUES (?, ?, ?, ?)`, [name, card_limit, due_day, close_day]);
  return result;
}

export async function updateCreditCard(id: number, data: { name?: string; card_limit?: number; due_day?: number; close_day?: number }) {
  const { name, card_limit, due_day, close_day } = data;
  const [result] = await db.execute(
    `UPDATE credit_cards SET name = COALESCE(?, name), card_limit = COALESCE(?, card_limit), due_day = COALESCE(?, due_day), close_day = COALESCE(?, close_day) WHERE id = ?`,
    [name, card_limit, due_day, close_day, id],
  );
  return result;
}

export async function deleteCreditCard(id: number) {
  const [result] = await db.execute(`DELETE FROM credit_cards WHERE id = ?`, [id]);
  return result;
}
