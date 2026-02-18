import { db } from "@/lib";
import { ResultSetHeader } from "mysql2";

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) return new Response("Name is required", { status: 400 });
    const [result] = await db.execute<ResultSetHeader>("INSERT INTO categories (name, type) VALUES (?, 'payment')", [name]);
    return new Response(JSON.stringify({ id: result.insertId, name }), { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await db.execute("SELECT id, name FROM categories WHERE type = 'payment'");
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return new Response("ID is required", { status: 400 });
    await db.execute("DELETE FROM categories WHERE id = ? AND type = 'payment'", [id]);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
