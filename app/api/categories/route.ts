export async function GET() {
  try {
    const [inbound, outbound, payments] = await Promise.all([
      fetch("http://localhost:3000/api/categories/inbound").then((res) => res.json()),
      fetch("http://localhost:3000/api/categories/outbound").then((res) => res.json()),
      fetch("http://localhost:3000/api/categories/payments").then((res) => res.json()),
    ]);
    return new Response(JSON.stringify({ inbound, outbound, payments }), { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response("Failed to fetch categories", { status: 500 });
  }
}
