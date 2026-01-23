"use client";

import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import ComboBox from "@/components/UI/ComboBox";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { maskCurrencyInput } from "@/utils";

interface Category {
  id: number;
  name: string;
}

interface Payment {
  id: number;
  name: string;
}

interface CreditCard {
  id: number;
  name: string;
}

interface FixedExpenseFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editingExpense?: any;
}

export default function FixedExpenseForm({ onClose, onSuccess, editingExpense }: FixedExpenseFormProps) {
  const [form, setForm] = useState({
    description: "",
    value: "",
    due_day: "",
    category_id: null as number | null,
    payment_id: null as number | null,
    credit_card_id: null as number | null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [isPaymentCredit, setIsPaymentCredit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchPayments();
    fetchCreditCards();

    if (editingExpense) {
      setForm({
        description: editingExpense.description,
        value: editingExpense.value.toString(),
        due_day: editingExpense.due_day.toString(),
        category_id: editingExpense.category_id,
        payment_id: editingExpense.payment_id,
        credit_card_id: editingExpense.credit_card_id || null,
      });
    }
  }, [editingExpense]);

  useEffect(() => {
    if (form.payment_id && payments.length > 0) {
      const selectedPayment = payments.find((p) => p.id === Number(form.payment_id));
      const isCreditPayment = selectedPayment?.name?.toLowerCase().includes("crédito") || selectedPayment?.name?.toLowerCase().includes("cartão");
      setIsPaymentCredit(isCreditPayment || false);

      if (!isCreditPayment) {
        setForm((prev) => ({ ...prev, credit_card_id: null }));
      }
    } else {
      setIsPaymentCredit(false);
    }
  }, [form.payment_id, payments]);

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories?type=outbound");
      if (!response.ok) throw new Error();

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setError("Erro ao carregar categorias.");
    }
  }

  async function fetchPayments() {
    try {
      const response = await fetch("/api/payments");
      if (!response.ok) throw new Error();

      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch {
      setError("Erro ao carregar métodos de pagamento.");
    }
  }

  async function fetchCreditCards() {
    try {
      const response = await fetch("/api/credit-cards");
      if (!response.ok) throw new Error();

      const data = await response.json();
      setCreditCards(Array.isArray(data) ? data : []);
    } catch {
      setError("Erro ao carregar cartões de crédito.");
    }
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    if (name === "value") {
      const masked = maskCurrencyInput(value);
      setForm((prev) => ({ ...prev, value: masked }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeComboBox = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmitForm(e: FormEvent) {
    e.preventDefault();

    if (!form.description || !form.value || !form.due_day || !form.category_id || !form.payment_id) {
      alert("Todos os campos obrigatórios devem ser preenchidos.");
      return;
    }

    // Se for pagamento com crédito, validar se cartão foi selecionado
    if (isPaymentCredit && !form.credit_card_id) {
      alert("Selecione um cartão de crédito.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const method = editingExpense ? "PATCH" : "POST";
      const body = {
        description: form.description,
        value: parseFloat(form.value),
        due_day: parseInt(form.due_day),
        category_id: form.category_id,
        payment_id: form.payment_id,
        credit_card_id: form.credit_card_id,
        ...(editingExpense && { id: editingExpense.id }),
      };

      const response = await fetch("/api/fixed-expenses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error();

      onSuccess();
      onClose();
    } catch {
      setError("Erro ao salvar despesa fixa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full bg-white rounded-lg p-4">
      <form className="flex flex-col gap-4" onSubmit={handleSubmitForm}>
        <h2 className="font-semibold text-lg">{editingExpense ? "Editar Despesa Fixa" : "Nova Despesa Fixa"}</h2>
        <Input label="Descrição:" name="description" placeholder="Descrição (ex: Netflix, Aluguel)" value={form.description} onChange={handleChangeInput} />
        <Input label="Valor:" name="value" inputMode="numeric" placeholder="R$ 0,00" value={form.value} onChange={handleChangeInput} required />
        <Input
          label="Dia do vencimento (1-31):"
          name="due_day"
          placeholder="Dia do vencimento (1-31)"
          type="number"
          min="1"
          max="31"
          value={form.due_day}
          onChange={handleChangeInput}
        />
        <ComboBox label="Categoria" options={categories} value={form.category_id} onChange={(value) => handleChangeComboBox("category_id", value)} />
        <ComboBox label="Método de Pagamento" options={payments} value={form.payment_id} onChange={(value) => handleChangeComboBox("payment_id", value)} />

        {isPaymentCredit && (
          <ComboBox label="Cartão de Crédito" options={creditCards} value={form.credit_card_id} onChange={(value) => handleChangeComboBox("credit_card_id", value)} />
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={loading} className="flex-1 py-2">
            {loading ? "Salvando..." : "Salvar"}
          </Button>
          <Button type="button" onClick={onClose} className="flex-1 py-2 bg-gray-300 text-gray-700 border-0" disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
