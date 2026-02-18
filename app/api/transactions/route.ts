import { db } from "@/lib";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  try {
    const { description, value, action, date, category } = await request.json();
    console.log("Received Transaction Data:", { description, value, action, date, category });

    const [result] = await db.execute<ResultSetHeader>("INSERT INTO transactions (description, value, action, date, category_id) VALUES (?, ?, ?, ?, ?)", [
      description,
      value,
      action,
      date,
      category,
    ]);

    console.log("Database Insert Result:", {
      insertId: result.insertId,
      affectedRows: result.affectedRows,
    });

    return new Response(
      JSON.stringify({
        message: "Transaction data received successfully!",
        insertId: result.insertId,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing transaction data:", error);
    return new Response(JSON.stringify({ message: "Failed to process transaction data." }), { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await db.execute<RowDataPacket[]>(`
      SELECT
        t.id,
        t.description,
        t.value,
        t.action,
        t.date,
        c.name category,
        t.created_at
    FROM
        transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        ORDER BY t.created_at DESC`);
        
    console.log("Fetched Transaction Data:", rows.length, "records");
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch transaction data." }), { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ message: "Transaction ID is required." }), { status: 400 });
    }
    const [result] = await db.execute<ResultSetHeader>("DELETE FROM transactions WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: "Transaction not found." }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "Transaction deleted successfully." }), { status: 200 });
  } catch (error) {
    console.error("Error deleting transaction data:", error);
    return new Response(JSON.stringify({ message: "Failed to delete transaction data." }), { status: 500 });
  }
}
