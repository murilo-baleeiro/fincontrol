"use client";

import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import GroupDown from "@/components/UI/GroupDown";

import { Check, CreditCard, Minus, X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { maskCurrencyInput, parseCurrency } from "@/utils";
import { CreditCards } from "@/@types";
import CreditCardsCard from "@/components/UI/CreditCardsCard";

export default function CreditCardForm() {
  const [form, setForm] = useState({
    name: "",
    card_limit: "",
    due_day: "",
    close_day: "",
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creditCards, setCreditCards] = useState<CreditCards[]>([]);
  const [openCardId, setOpenCardId] = useState<number | null>(null);

  useEffect(() => {
    fetchCreditCards();
  }, []);

  async function fetchCreditCards() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/credit-cards");
      if (!response.ok) throw new Error();

      const data = await response.json();
      setCreditCards(Array.isArray(data) ? data : []);
    } catch {
      setError("Erro ao carregar cartões de crédito.");
      setCreditCards([]);
    } finally {
      setLoading(false);
    }
  }

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
      setError(null);
      fetchCreditCards();
    } catch {
      setError("Erro ao criar cartão de crédito.");
    }
  }

  async function handleDeleteCreditCard(id: number) {
    try {
      const response = await fetch(`/api/credit-cards?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();
      fetchCreditCards();
    } catch {
      setError("Erro ao deletar cartão de crédito.");
    }
    setOpenCardId(null);
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  const handleOpenCard = (id: number) => {
    setOpenCardId(id);
  };

  const handleCloseCard = () => {
    setOpenCardId(null);
  };

  return (
    <main className="px-4">
      {showForm && (
        <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmitForm}>
          <Input label="Nome do Cartão/Banco:" name="name" placeholder="Ex.: Crédito Nubank, Débito Santander" value={form.name} onChange={handleChangeInput} required />
          <Input label="Limite Total:" name="card_limit" inputMode="numeric" placeholder="0,00" value={form.card_limit} onChange={handleChangeInput} required />
          <div className="flex flex-row gap-2">
            <Input label="Dia do Vencimento:" name="due_day" type="number" placeholder="Ex.: 20" value={form.due_day} onChange={handleChangeInput} required min="1" max="31" />
            <Input
              label="Fechamento da Fatura:"
              name="close_day"
              type="number"
              placeholder="Ex.: 10"
              value={form.close_day}
              onChange={handleChangeInput}
              required
              min="1"
              max="31"
            />
          </div>
        </form>
      )}
      <Button
        onClick={() => {
          showForm ? handleSubmitForm(new Event("submit") as unknown as FormEvent) : setShowForm(true);
        }}
        className="mt-4"
      >
        {showForm ? "Salvar Cartão" : "Adicionar Cartão"}
      </Button>

      {error && <p className="w-full text-center text-sm text-red-500 mt-2">{error}</p>}

      <section className="mt-4">
        {loading && <p className="w-full text-center text-sm text-gray-500 mt-2">Carregando...</p>}
        {!loading && !error && creditCards.length === 0 && <p className="w-full text-center text-sm text-gray-500 mt-2">Nenhum cartão encontrado.</p>}
        {!loading && creditCards.length > 0 && (
          <ul className="mt-1 divide-y divide-gray-200">
            {creditCards.map((creditCard, _index) => (
              // <li key={id} className="p-3 flex flex-col gap-1 border border-gray-300 rounded-md">
              //   <div className="flex flex-row justify-between items-center gap-2">
              //     <CreditCard strokeWidth={1.5} className="w-14 text-blue-500" />
              //     <div className="flex flex-col">
              //       <span className="font-semibold">{name}</span>
              //       <span className="font-light">Limite: {formatCurrency(card_limit)}</span>
              //       <span className="text-xs text-gray-400">
              //         Vencimento: {due_day} | Fechamento: {close_day}
              //       </span>
              //     </div>
              //     <div className="relative w-16 h-6">
              //       <Minus
              //         className={`absolute right-0 text-red-500 transition-all duration-200 cursor-pointer ${
              //           confirmOpenId === id ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
              //         }`}
              //         onClick={() => setConfirmOpenId(id)}
              //       />
              //       <div
              //         className={`absolute right-0 flex gap-4 transition-all duration-200 ${
              //           confirmOpenId === id ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
              //         }`}
              //       >
              //         <Check className="text-emerald-500 cursor-pointer" onClick={() => handleDeleteCreditCard(id)} />
              //         <X className="text-red-500 cursor-pointer" onClick={() => setConfirmOpenId(null)} />
              //       </div>
              //     </div>
              //   </div>
              // </li>
              <CreditCardsCard
                key={creditCard.id}
                isOpen={openCardId === creditCard.id}
                onOpen={handleOpenCard}
                onClose={handleCloseCard}
                onDelete={handleDeleteCreditCard}
                creditCardData={creditCard}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
