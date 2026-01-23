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

// export async function createTransaction(data: {
//   action: "inbound" | "outbound";
//   description: string;
//   value: number;
//   date: string;
//   category?: number;
//   payment?: number;
//   creditCard?: number;
// }) {
//   const { action, description, value, date, category, payment, creditCard } = data;

//   const [result] = await db.execute(
//     `INSERT INTO transactions (action, description, value, date, category_id, payment_id, credit_card_id)
//      VALUES (?, ?, ?, ?, ?, ?, ?)`,
//     [action, description, value, date, category || null, payment || null, creditCard || null],
//   );

//   return result;
// }

export async function createTransaction(data: {
  action: "inbound" | "outbound";
  description: string;
  value: number;
  date: string;
  category?: number;
  payment?: number;
  creditCard?: number;
}) {
  const { action, description, value, date, category, payment, creditCard } =
    data;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();
    await conn.execute(
      `INSERT INTO transactions
        (action, description, value, date, category_id, payment_id, credit_card_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        action,
        description,
        value,
        date,
        category || null,
        payment || null,
        creditCard || null,
      ],
    );

    if (category) {
      await conn.execute(
        `
        UPDATE categories
        SET usage_count = usage_count + 1
        WHERE id = ?
        `,
        [category],
      );
    }

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function deleteTransaction(id: number) {
  const [result] = await db.execute(`DELETE FROM transactions WHERE id = ?`, [
    id,
  ]);
  return result;
}
