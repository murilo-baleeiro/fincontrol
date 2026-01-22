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

export async function getCreditCards(): Promise<CreditCard[]> {
    const [rows] = await db.query<CreditCard[]>(`SELECT * FROM credit_cards ORDER BY id ASC`);
    return rows;
}

export async function createCreditCard(data: { name: string; card_limit: number; due_day: number; close_day: number }) {
    const { name, card_limit, due_day, close_day } = data;
    const [result] = await db.execute(
        `INSERT INTO credit_cards (name, card_limit, due_day, close_day) VALUES (?, ?, ?, ?)`,
        [name, card_limit, due_day, close_day]
    );
    return result;
}

export async function deleteCreditCard(id: number) {
    const [result] = await db.execute(`DELETE FROM credit_cards WHERE id = ?`, [id]);
    return result;
}
