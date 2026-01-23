import { NextResponse, NextRequest } from "next/server";
import { getFixedExpenses, getFixedExpenseById, createFixedExpense, updateFixedExpense, deleteFixedExpense } from "@/lib/db";

export async function GET() {
  try {
    const fixedExpenses = await getFixedExpenses();
    return NextResponse.json(fixedExpenses, { status: 200 });
  } catch (error) {
    console.error("GET /api/fixed-expenses error:", error);
    return NextResponse.json({ message: "Erro ao buscar despesas fixas." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, value, due_day, category_id, payment_id, credit_card_id, is_active } = body;

    if (!description || !value || !due_day || !category_id || !payment_id) {
      return NextResponse.json(
        {
          message: "Campos obrigatórios: description, value, due_day, category_id, payment_id",
        },
        { status: 400 },
      );
    }

    await createFixedExpense({
      description,
      value,
      due_day,
      category_id,
      payment_id,
      credit_card_id: credit_card_id || null,
      is_active: is_active ?? true,
    });

    return NextResponse.json({ message: "Despesa fixa criada com sucesso." }, { status: 201 });
  } catch (error) {
    console.error("POST /api/fixed-expenses error:", error);
    return NextResponse.json({ message: "Erro ao criar despesa fixa." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, description, value, due_day, category_id, payment_id, credit_card_id, is_active } = body;

    if (!id) {
      return NextResponse.json({ message: "ID é obrigatório." }, { status: 400 });
    }

    await updateFixedExpense(id, {
      description,
      value,
      due_day,
      category_id,
      payment_id,
      credit_card_id,
      is_active,
    });

    return NextResponse.json({ message: "Despesa fixa atualizada com sucesso." }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/fixed-expenses error:", error);
    return NextResponse.json({ message: "Erro ao atualizar despesa fixa." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: "ID é obrigatório." }, { status: 400 });
    }

    await deleteFixedExpense(id);

    return NextResponse.json({ message: "Despesa fixa deletada com sucesso." }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/fixed-expenses error:", error);
    return NextResponse.json({ message: "Erro ao deletar despesa fixa." }, { status: 500 });
  }
}
