import { getPaymentsMethods, createPaymentMethod, deletePaymentMethod } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const payments = await getPaymentsMethods();
        return NextResponse.json(payments, { status: 200 });
    } catch (error) {
        console.error("GET /api/payments error:", error);
        return NextResponse.json({ message: "Erro ao buscar métodos de pagamento." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ message: "Campo 'name' é obrigatório" }, { status: 400 });
        }

        await createPaymentMethod({ name });
        return NextResponse.json({ message: "Método de pagamento criado com sucesso" }, { status: 201 });
    } catch (error) {
        console.error("POST /api/payments error:", error);
        return NextResponse.json({ message: "Erro ao criar método de pagamento" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "ID do método de pagamento é obrigatório" }, { status: 400 });
        }

        await deletePaymentMethod(Number(id));
        return NextResponse.json({ message: "Método de pagamento deletado com sucesso" }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/payments error:", error);
        return NextResponse.json({ message: "Erro ao deletar método de pagamento" }, { status: 500 });
    }
}
