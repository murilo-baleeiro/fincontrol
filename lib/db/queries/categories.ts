import { db } from "../connections";
import { RowDataPacket } from "mysql2/promise";

interface Categories extends RowDataPacket {
  id: number;
  name: string;
}

export async function getCategories() {
  const [rows] = await db.query<Categories[]>("SELECT * FROM categories");
  return rows;
}

export async function createCategory(data: { name: string }) {
  const { name } = data;
  const [result] = await db.execute(
    `INSERT INTO categories (name)
     VALUES (?)`,
    [name]
  );

  return result;
}

export async function deleteCategory(id: number) {
  const [result] = await db.execute(`DELETE FROM categories WHERE id = ?`, [
    id,
  ]);
  return result;
}
