"use client";

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
      <fieldset className="flex flex-col">
        <label className="text-gray-900 text-sm">Descrição:</label>
        <input
          type="text"
          name="description"
          placeholder="Ex.: Salário, Internet"
          className="border border-gray-400 rounded px-2 py-1"
          value={form.description}
          onChange={handleChangeInput}
        />
      </fieldset>

      <div className="flex flex-row gap-4">
        <fieldset className="flex flex-col">
          <label className="text-gray-900 text-sm">Valor:</label>
          <input
            type="text"
            name="value"
            inputMode="numeric"
            placeholder="0,00"
            className="border border-gray-400 rounded px-2 py-1"
            value={form.value}
            onChange={handleChangeInput}
          />
        </fieldset>

        <fieldset className="w-full flex flex-col">
          <label className="text-gray-900 text-sm">Data:</label>
          <input type="date" name="date" className="w-full border border-gray-400 rounded px-1 py-1" value={form.date} onChange={handleChangeInput} />
        </fieldset>
      </div>

      <button type="submit" className="bg-blue-500 text-white h-10 mt-2 rounded">
        Registrar {form.action === "inbound" ? "Receita" : "Despesa"}
      </button>
    </form>
  );
}
