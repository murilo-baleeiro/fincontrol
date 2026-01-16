"use client";

import { CircleArrowUp, CircleArrowDown } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";

export default function Transactions() {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    show: false,
    action: "",
    description: "",
    value: 0,
    date: today,
  });

  const handleActiveForm = (action: string) => {
    setForm((prev: any) => ({ ...prev, show: true, action }));
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Dados Enviados!");
  };

  return (
    <main className="px-4">
      <div className="w-full mt-4 flex flex-row gap-4 justify-around">
        <button
          className="h-10 flex-1 bg-red-400 text-white rounded-md flex flex-row justify-center items-center gap-2"
          onClick={() => handleActiveForm("outbound")}
        >
          <CircleArrowUp strokeWidth={1.5} size={20} />
          <span>Despesas</span>
        </button>
        <button
          className="flex-1 bg-emerald-400 text-white rounded-md flex flex-row justify-center items-center gap-2"
          onClick={() => handleActiveForm("inbound")}
        >
          <CircleArrowDown strokeWidth={1.5} size={20} />
          <span>Receita</span>
        </button>
      </div>
      {form.show && (
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
      )}
    </main>
  );
}
