"use client";

import Button from "@/components/UI/Button";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import { formatCurrency, parseCurrency } from "@/utils";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";

interface TransactionFormProps {
  action: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TransactionForm({ action, onClose, onSuccess }: TransactionFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    action,
    description: "",
    value: "",
    date: today,
    category: null as number | null,
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, action }));
  }, [action]);

  useEffect(() => {
    if (form.action !== "outbound") return;
    async function loadCategories() {
      try {
        const response = await fetch("/api/configs/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao carregar categorias", error);
      }
    }

    loadCategories();
  }, [form.action]);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    if (name === "value") {
      const masked = formatCurrency(value);
      setForm((prev) => ({ ...prev, value: masked }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmitForm(e: FormEvent) {
    e.preventDefault();
    const parsedValue = parseCurrency(form.value);

    if (isNaN(parsedValue) || parsedValue <= 0) {
      alert("Forneça um valor válido");
      return;
    }

    const payload = {
      ...form,
      value: parsedValue,
    };

    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      onSuccess();
      onClose();
    } else {
      alert("Erro ao registrar transação");
    }
  }

  return (
    <form onSubmit={handleSubmitForm} className="mt-4 flex flex-col gap-2">
      <Input label="Descrição:" name="description" placeholder="Ex.: Salário, Internet" value={form.description} onChange={handleChangeInput} required />
      <div className="flex flex-row gap-4 items-center">
        <Input label="Valor:" name="value" inputMode="numeric" placeholder="0,00" value={form.value} onChange={handleChangeInput} required />
        <Input label="Data:" type="date" name="date" value={form.date} onChange={handleChangeInput} className="h-8.5 px-2 py-1" />
      </div>
      {form.action === "outbound" && (
        <ComboBox label="Categoria:" options={categories} value={form.category} onChange={(id) => setForm((prev) => ({ ...prev, category: id }))} />
      )}
      <Button className="mt-2">Salvar {form.action === "inbound" ? "Receita" : "Despesa"}</Button>
    </form>
  );
}
