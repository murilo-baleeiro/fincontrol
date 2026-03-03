import { db } from "@/lib";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { signToken } from "../../../lib/auth";

// POST /api/auth
// body: { code: string }
// verifies code against access_code table and returns cookie with JWT
export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    console.log(`[Auth] Received code:`, code);
    
    if (!code) return new Response("Código de acesso é necessário", { status: 400 });

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT code FROM access_code WHERE code = ? LIMIT 1",
      [code]
    );

    if ((rows as any[]).length === 0) {
      console.log(`[Auth] Invalid code`);
      return new Response("Código inválido", { status: 401 });
    }

    const token = signToken({ authenticated: true });
    console.log(`[Auth] Token generated:`, token);
    
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

    const res = new Response(JSON.stringify({ success: true }), { status: 200 });
    res.headers.set(
      "Set-Cookie",
      `access_token=${token}; HttpOnly; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax`
    );
    
    console.log(`[Auth] Cookie set, response sent`);

    return res;
  } catch (error) {
    console.error("Error in /api/auth POST:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
