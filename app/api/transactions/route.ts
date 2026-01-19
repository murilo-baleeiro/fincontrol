import { NextResponse } from "next/server";
import { getTransactions, createTransaction, deleteTransaction } from "@/lib/db";

export async function GET() {
  try {
    const transactions = await getTransactions();
    return NextResponse.json(transactions, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /transactions error:", error);
    return NextResponse.json({ message: "Erro ao buscar transações" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, description, value, date } = body;
    if (!action || !description || !value || !date) {
      return NextResponse.json({ message: "Campos obrigatórios faltando" }, { status: 400 });
    }
    await createTransaction({ action, description, value, date });
    return NextResponse.json({ message: "Transação criada com sucesso" }, { status: 201 });
  } catch (error) {
    console.error("POST /transactions error:", error);
    return NextResponse.json({ message: "Erro ao criar transação" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "ID da transação é obrigatório" }, { status: 400 });
    }
    await deleteTransaction(Number(id));
    return NextResponse.json({ message: "Transação deletada com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /transactions error:", error);
    return NextResponse.json({ message: "Erro ao deletar transação" }, { status: 500 });
  }
}
