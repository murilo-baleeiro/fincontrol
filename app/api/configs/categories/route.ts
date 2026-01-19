import { createCategory, deleteCategory, getCategories } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const configs = await getCategories();
    return NextResponse.json(configs, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /configs error:", error);
    return NextResponse.json(
      { message: "Erro ao buscar categorias." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;
    if (!name) {
      return NextResponse.json(
        { message: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }
    await createCategory({ name });
    return NextResponse.json(
      { message: "Categoria criada com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /configs/categories error:", error);
    return NextResponse.json(
      { message: "Erro ao criar categoria" },
      { status: 500 }
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
        { status: 400 }
      );
    }
    await deleteCategory(Number(id));
    return NextResponse.json(
      { message: "Categoria deletada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /transactions error:", error);
    return NextResponse.json(
      { message: "Erro ao deletar categoria" },
      { status: 500 }
    );
  }
}
