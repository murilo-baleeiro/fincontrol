"use client";

import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";

interface TransactionFormProps {
  action: string;
  onClose: () => void;
  onSuccess: () => void;
}

function formatCurrency(value: string) {
  const digits = value.replace(/\D/g, "");
  const number = Number(digits) / 100;

  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseCurrency(value: string): number {
  return Number(value.replace(/\./g, "").replace(",", "."));
}

export default function TransactionForm({ action, onClose, onSuccess }: TransactionFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    action,
    description: "",
    value: "",
    date: today,
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, action }));
  }, [action]);

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
      alert("Valor inválido");
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
      alert("Erro ao criar transação");
    }
  }

  return (
    <form onSubmit={handleSubmitForm} className="mt-4 flex flex-col gap-2">
      <Input label="Descrição:" name="description" placeholder="Ex.: Salário, Internet" value={form.description} onChange={handleChangeInput} />
      <div className="flex flex-row gap-4">
        <Input label="Valor:" name="value" inputMode="numeric" placeholder="0,00" value={form.value} onChange={handleChangeInput} />
        <Input label="Data:" type="date" name="date" value={form.date} onChange={handleChangeInput} className="w-full h-8.5 border border-gray-400 rounded px-1 py-1" />
      </div>
      <Button className="mt-2">Registrar {form.action === "inbound" ? "Receita" : "Despesa"}</Button>
    </form>
  );
}
