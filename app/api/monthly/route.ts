import { db } from "@/lib";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  try {
    const { name, value, payday } = await request.json();
    console.log("Received Monthly Data:", { name, value, payday });

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO monthly (name, value, payday) VALUES (?, ?, ?)",
      [name, value, payday],
    );

    console.log("Database Insert Result:", {
      insertId: result.insertId,
      affectedRows: result.affectedRows,
    });

    return new Response(
      JSON.stringify({
        message: "Monthly data received successfully!",
        insertId: result.insertId,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing monthly data:", error);
    return new Response(
      JSON.stringify({ message: "Failed to process monthly data." }),
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM monthly");
    console.log("Fetched Monthly Data:", rows.length, "records");
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch monthly data." }),
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    console.log("Received request to delete Monthly ID:", id);
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM monthly WHERE id = ?",
      [id],
    );
    console.log("Database Delete Result:", {
      affectedRows: result.affectedRows,
    });
    return new Response(
      JSON.stringify({ message: "Monthly data deleted successfully!" }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting monthly data:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete monthly data." }),
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, active } = await request.json();
    console.log("Received Monthly Update Data:", { id, active });
    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE monthly SET active = ? WHERE id = ?",
      [active, id],
    );
    console.log("Database Update Result:", {
      affectedRows: result.affectedRows,
    });
    return new Response(
      JSON.stringify({ message: "Monthly data updated successfully!" }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating monthly data:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update monthly data." }),
      { status: 500 },
    );
  }
}
