import { db } from "@/lib";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [inboundRows] = (await db.execute<RowDataPacket[]>(
      "SELECT id, name, type, (SELECT COUNT(*) FROM transactions t WHERE t.category_id = c.id) AS count_usage FROM categories c WHERE type = 'inbound' ORDER BY count_usage DESC"
    )) as [RowDataPacket[], any];
    const [outboundRows] = (await db.execute<RowDataPacket[]>(
      "SELECT id, name, type, (SELECT COUNT(*) FROM transactions t WHERE t.category_id = c.id) AS count_usage FROM categories c WHERE type = 'outbound' ORDER BY count_usage DESC"
    )) as [RowDataPacket[], any];
    const [paymentsRows] = (await db.execute<RowDataPacket[]>(
      "SELECT id, name, type, (SELECT COUNT(*) FROM transactions t WHERE t.category_id = c.id) AS count_usage FROM categories c WHERE type = 'payments' ORDER BY count_usage DESC"
    )) as [RowDataPacket[], any];

    return new Response(JSON.stringify({ inbound: inboundRows, outbound: outboundRows, payments: paymentsRows }), { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response("Failed to fetch categories", { status: 500 });
  }
}
