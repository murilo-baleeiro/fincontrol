import { db } from "../connections";
import { RowDataPacket } from "mysql2/promise";

interface FixedExpense extends RowDataPacket {
  id: number;
  description: string;
  value: number;
  due_day: number;
  category_id: number;
  payment_id: number;
  credit_card_id?: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface FixedExpenseWithCategoryAndPayment extends FixedExpense {
  category_name?: string;
  payment_name?: string;
  credit_card_name?: string;
}

export async function getFixedExpenses(): Promise<FixedExpenseWithCategoryAndPayment[]> {
  const [rows] = await db.query<FixedExpenseWithCategoryAndPayment[]>(`
    SELECT 
      fe.id,
      fe.description,
      fe.value,
      fe.due_day,
      fe.category_id,
      fe.payment_id,
      fe.credit_card_id,
      fe.is_active,
      fe.created_at,
      fe.updated_at,
      c.name AS category_name,
      p.name AS payment_name,
      cc.name AS credit_card_name
    FROM fixed_expenses fe
    LEFT JOIN categories c ON c.id = fe.category_id
    LEFT JOIN payments p ON p.id = fe.payment_id
    LEFT JOIN credit_cards cc ON cc.id = fe.credit_card_id
    ORDER BY fe.due_day ASC
  `);
  return rows;
}

export async function getFixedExpenseById(id: number): Promise<FixedExpenseWithCategoryAndPayment | null> {
  const [rows] = await db.query<FixedExpenseWithCategoryAndPayment[]>(
    `
    SELECT 
      fe.id,
      fe.description,
      fe.value,
      fe.due_day,
      fe.category_id,
      fe.payment_id,
      fe.credit_card_id,
      fe.is_active,
      fe.created_at,
      fe.updated_at,
      c.name AS category_name,
      p.name AS payment_name,
      cc.name AS credit_card_name
    FROM fixed_expenses fe
    LEFT JOIN categories c ON c.id = fe.category_id
    LEFT JOIN payments p ON p.id = fe.payment_id
    LEFT JOIN credit_cards cc ON cc.id = fe.credit_card_id
    WHERE fe.id = ?
  `,
    [id],
  );

  return rows.length > 0 ? rows[0] : null;
}

export async function getUpcomingPayments(daysAhead: number = 7, month?: number, year?: number): Promise<FixedExpenseWithCategoryAndPayment[]> {
  const today = new Date();
  const currentDay = today.getDate();

  let query = `
    SELECT 
      fe.id,
      fe.description,
      fe.value,
      fe.due_day,
      fe.category_id,
      fe.payment_id,
      fe.credit_card_id,
      fe.is_active,
      fe.created_at,
      fe.updated_at,
      c.name AS category_name,
      p.name AS payment_name,
      cc.name AS credit_card_name
    FROM fixed_expenses fe
    LEFT JOIN categories c ON c.id = fe.category_id
    LEFT JOIN payments p ON p.id = fe.payment_id
    LEFT JOIN credit_cards cc ON cc.id = fe.credit_card_id
    WHERE fe.is_active = TRUE
    AND fe.due_day >= ? 
    AND fe.due_day <= ?
  `;

  const params: number[] = [currentDay, currentDay + daysAhead];

  query += ` ORDER BY fe.due_day ASC`;

  const [rows] = await db.query<FixedExpenseWithCategoryAndPayment[]>(query, params);
  return rows;
}

export async function getPaymentsDueToday(): Promise<FixedExpenseWithCategoryAndPayment[]> {
  const today = new Date();
  const currentDay = today.getDate();

  const [rows] = await db.query<FixedExpenseWithCategoryAndPayment[]>(
    `
    SELECT 
      fe.id,
      fe.description,
      fe.value,
      fe.due_day,
      fe.category_id,
      fe.payment_id,
      fe.credit_card_id,
      fe.is_active,
      fe.created_at,
      fe.updated_at,
      c.name AS category_name,
      p.name AS payment_name,
      cc.name AS credit_card_name
    FROM fixed_expenses fe
    LEFT JOIN categories c ON c.id = fe.category_id
    LEFT JOIN payments p ON p.id = fe.payment_id
    LEFT JOIN credit_cards cc ON cc.id = fe.credit_card_id
    WHERE fe.is_active = TRUE
    AND fe.due_day = ?
  `,
    [currentDay],
  );

  return rows;
}

export async function checkIfTransactionExists(fixedExpenseId: number, month: number, year: number): Promise<boolean> {
  const [rows] = await db.query<RowDataPacket[]>(
    `
    SELECT id FROM transactions 
    WHERE fixed_expense_id = ? 
    AND MONTH(date) = ? 
    AND YEAR(date) = ?
    LIMIT 1
  `,
    [fixedExpenseId, month + 1, year],
  );

  return rows.length > 0;
}

export async function createFixedExpense(data: {
  description: string;
  value: number;
  due_day: number;
  category_id: number;
  payment_id: number;
  credit_card_id?: number | null;
  is_active?: boolean;
}) {
  const { description, value, due_day, category_id, payment_id, credit_card_id, is_active = true } = data;

  const [result] = await db.execute(
    `INSERT INTO fixed_expenses (description, value, due_day, category_id, payment_id, credit_card_id, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [description, value, due_day, category_id, payment_id, credit_card_id || null, is_active],
  );

  return result;
}

export async function updateFixedExpense(
  id: number,
  data: {
    description?: string;
    value?: number;
    due_day?: number;
    category_id?: number;
    payment_id?: number;
    credit_card_id?: number | null;
    is_active?: boolean;
  },
) {
  const { description, value, due_day, category_id, payment_id, credit_card_id, is_active } = data;

  const [result] = await db.execute(
    `UPDATE fixed_expenses 
     SET description = COALESCE(?, description),
         value = COALESCE(?, value),
         due_day = COALESCE(?, due_day),
         category_id = COALESCE(?, category_id),
         payment_id = COALESCE(?, payment_id),
         credit_card_id = IF(? IS NOT NULL, ?, credit_card_id),
         is_active = COALESCE(?, is_active)
     WHERE id = ?`,
    [
      description ?? null,
      value ?? null,
      due_day ?? null,
      category_id ?? null,
      payment_id ?? null,
      credit_card_id !== undefined ? credit_card_id : null,
      credit_card_id ?? null,
      is_active ?? null,
      id,
    ],
  );

  return result;
}

export async function deleteFixedExpense(id: number) {
  const [result] = await db.execute(`DELETE FROM fixed_expenses WHERE id = ?`, [id]);

  return result;
}
