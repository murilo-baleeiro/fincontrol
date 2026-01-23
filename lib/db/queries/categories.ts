import { Categories } from "@/@types";
import { db } from "../connections";

// export async function getCategoriesByType(type: "inbound" | "outbound"): Promise<Categories[]> {
//   const [rows] = await db.query<Categories[]>(`SELECT id, name FROM categories WHERE type = ? ORDER BY id ASC`, [type]);
//   return rows;
// }

export async function getCategoriesByType(type: "inbound" | "outbound") {
  const [rows] = await db.query<Categories[]>(
    `
    SELECT
      id,
      name,
      usage_count
    FROM categories
    WHERE type = ?
    ORDER BY
      usage_count DESC,
      name ASC
    `,
    [type],
  );

  return rows;
}

export async function createCategory(data: {
  name: string;
  type: "inbound" | "outbound";
}) {
  const { name, type } = data;
  const [result] = await db.execute(
    `INSERT INTO categories (name, type) VALUES (?, ?)`,
    [name, type],
  );
  return result;
}

export async function deleteCategory(id: number) {
  const [result] = await db.execute(`DELETE FROM categories WHERE id = ?`, [
    id,
  ]);
  return result;
}
