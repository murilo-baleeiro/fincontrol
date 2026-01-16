"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";

interface TransactionFormProps {
  action: string;
  onClose: () => void;
}

export default function TransactionForm({ action, onClose }: TransactionFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    action,
    description: "",
    value: 0,
    date: today,
  });

  useEffect(() => setForm((prev) => ({ ...prev, action })), [action]);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose();
  };

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
            inputMode="decimal"
            pattern="^\d+([.,]\d{1,2})?$"
            placeholder="0,00"
            className="border border-gray-400 rounded px-2 py-1"
            value={form.value}
            onChange={handleChangeInput}
          />
        </fieldset>
        <fieldset className="w-full flex flex-col">
          <label className="text-gray-900 text-sm">Data:</label>
          <input
            type="date"
            name="date"
            className="w-full border border-gray-400 rounded px-1 py-1 h-8.5"
            value={form.date}
            onChange={handleChangeInput}
          />
        </fieldset>
      </div>
      <button type="submit" className="bg-blue-500 text-white h-10 mt-2 rounded">
        Registrar {form.action == "inbound" ? "Receita" : "Despesa"}
      </button>
    </form>
  );
}
