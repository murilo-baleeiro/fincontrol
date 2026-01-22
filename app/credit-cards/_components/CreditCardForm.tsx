"use client";

import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { ChangeEvent, FormEvent, useState } from "react";
import { maskCurrencyInput, parseCurrency } from "@/utils";

interface CreditCardFormComponentProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreditCardFormComponent({ onClose, onSuccess }: CreditCardFormComponentProps) {
  const [form, setForm] = useState({
    name: "",
    card_limit: "",
    due_day: "",
    close_day: "",
  });

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    if (name === "card_limit") {
      const masked = maskCurrencyInput(value);
      setForm((prev) => ({ ...prev, card_limit: masked }));
      return;
    }

    if (name === "due_day" || name === "close_day") {
      const numValue = value.replace(/\D/g, "");
      if (numValue === "" || (parseInt(numValue) >= 1 && parseInt(numValue) <= 31)) {
        setForm((prev) => ({ ...prev, [name]: numValue }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmitForm(e: FormEvent) {
    e.preventDefault();

    if (!form.name || !form.card_limit || !form.due_day || !form.close_day) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    const parsedLimit = parseCurrency(form.card_limit);
    const parsedDueDay = parseInt(form.due_day);
    const parsedCloseDay = parseInt(form.close_day);

    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      alert("Forneça um limite válido.");
      return;
    }

    if (parsedDueDay < 1 || parsedDueDay > 31 || parsedCloseDay < 1 || parsedCloseDay > 31) {
      alert("Dias devem estar entre 1 e 31.");
      return;
    }

    try {
      const response = await fetch("/api/credit-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          card_limit: parsedLimit,
          due_day: parsedDueDay,
          close_day: parsedCloseDay,
        }),
      });

      if (!response.ok) throw new Error();
      setForm({ name: "", card_limit: "", due_day: "", close_day: "" });
      onSuccess();
      onClose();
    } catch {
      alert("Erro ao criar cartão de crédito.");
    }
  }

  return (
    <form className="mt-4 flex flex-col gap-2" onSubmit={handleSubmitForm}>
      <Input label="Nome do Cartão/Banco:" name="name" placeholder="Ex.: Crédito Nubank, Débito Santander" value={form.name} onChange={handleChangeInput} required />
      <Input label="Limite Total:" name="card_limit" inputMode="numeric" placeholder="0,00" value={form.card_limit} onChange={handleChangeInput} required />
      <div className="flex flex-row gap-2">
        <Input label="Dia do Vencimento:" name="due_day" type="number" placeholder="Ex.: 20" value={form.due_day} onChange={handleChangeInput} required min="1" max="31" />
        <Input label="Fechamento da Fatura:" name="close_day" type="number" placeholder="Ex.: 10" value={form.close_day} onChange={handleChangeInput} required min="1" max="31" />
      </div>
      <Button className="mt-2">Salvar Cartão</Button>
    </form>
  );
}
