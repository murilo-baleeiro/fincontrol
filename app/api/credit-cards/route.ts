import { db } from "@/lib";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  try {
    const { name, cardlimit, payday } = await request.json();
    console.log("Received Credit Card Data:", { name, cardlimit, payday });
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO creditcards (name, cardlimit, payday) VALUES (?, ?, ?)",
      [name, cardlimit, payday],
    );
    console.log("Database Insert Result:", result);
    return new Response(
      JSON.stringify({ success: true, id: result.insertId }),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error inserting credit card data:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to insert credit card data.",
      }),
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM creditcards");
    console.log("Fetched Credit Card Data:", rows.length, "records");
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching credit card data:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch credit card data.",
      }),
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "ID parameter is required." }),
        { status: 400 },
      );
    }
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM creditcards WHERE id = ?",
      [id],
    );
    console.log("Database Delete Result:", result);
    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No record found with the given ID.",
        }),
        { status: 404 },
      );
    } else {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Credit card entry deleted successfully.",
        }),
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Error deleting credit card entry:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to delete credit card entry.",
      }),
      { status: 500 },
    );
  }
}
