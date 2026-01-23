import { getCategoriesByType, createCategory, deleteCategory } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type || (type !== "inbound" && type !== "outbound")) {
      return NextResponse.json(
        {
          message:
            "Parâmetro 'type' é obrigatório e deve ser 'inbound' ou 'outbound'",
        },
        { status: 400 },
      );
    }

    const categories = await getCategoriesByType(
      type as "inbound" | "outbound",
    );
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { message: "Erro ao buscar categorias." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type } = body;

    if (!name || !type) {
      return NextResponse.json(
        { message: "Campos 'name' e 'type' são obrigatórios" },
        { status: 400 },
      );
    }

    if (type !== "inbound" && type !== "outbound") {
      return NextResponse.json(
        { message: "Campo 'type' deve ser 'inbound' ou 'outbound'" },
        { status: 400 },
      );
    }

    await createCategory({ name, type });
    return NextResponse.json(
      { message: "Categoria criada com sucesso" },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { message: "Erro ao criar categoria" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID da categoria é obrigatório" },
        { status: 400 },
      );
    }

    await deleteCategory(Number(id));
    return NextResponse.json(
      { message: "Categoria deletada com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/categories error:", error);
    return NextResponse.json(
      { message: "Erro ao deletar categoria" },
      { status: 500 },
    );
  }
}
