import { getCreditCards, createCreditCard, deleteCreditCard, updateCreditCard } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const creditCards = await getCreditCards();
    return NextResponse.json(creditCards, { status: 200 });
  } catch (error) {
    console.error("GET /api/credit-cards error:", error);
    return NextResponse.json({ message: "Erro ao buscar cartões de crédito." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, card_limit, due_day, close_day } = body;

    if (!name || !card_limit || !due_day || !close_day) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    if (due_day < 1 || due_day > 31 || close_day < 1 || close_day > 31) {
      return NextResponse.json({ message: "Dias devem estar entre 1 e 31" }, { status: 400 });
    }

    await createCreditCard({ name, card_limit, due_day, close_day });
    return NextResponse.json({ message: "Cartão de crédito criado com sucesso" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/credit-cards error:", error);
    return NextResponse.json({ message: "Erro ao criar cartão de crédito" }, { status: 500 });
  }
}

export async function UPDATE(request: Request) {
  try {
    const body = await request.json();
    const { id, name, card_limit, due_day, close_day } = body;
    if (!id || !name || !card_limit || !due_day || !close_day) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    if (due_day < 1 || due_day > 31 || close_day < 1 || close_day > 31) {
      return NextResponse.json({ message: "Dias devem estar entre 1 e 31" }, { status: 400 });
    }

    await updateCreditCard(id, { name, card_limit, due_day, close_day });
    return NextResponse.json({ message: "Cartão de crédito atualizado com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("UPDATE /api/credit-cards error:", error);
    return NextResponse.json({ message: "Erro ao atualizar cartão de crédito" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, card_limit, due_day, close_day } = body;
    if (!id || !name || !card_limit || !due_day || !close_day) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    if (due_day < 1 || due_day > 31 || close_day < 1 || close_day > 31) {
      return NextResponse.json({ message: "Dias devem estar entre 1 e 31" }, { status: 400 });
    }

    await updateCreditCard(id, { name, card_limit, due_day, close_day });
    return NextResponse.json({ message: "Cartão de crédito atualizado com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/credit-cards error:", error);
    return NextResponse.json({ message: "Erro ao atualizar cartão de crédito" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID do cartão de crédito é obrigatório" }, { status: 400 });
    }

    await deleteCreditCard(Number(id));
    return NextResponse.json({ message: "Cartão de crédito deletado com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/credit-cards error:", error);
    return NextResponse.json({ message: "Erro ao deletar cartão de crédito" }, { status: 500 });
  }
}
