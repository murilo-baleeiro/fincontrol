"use client";

import { useState, useEffect } from "react";
import { CreditCard as CreditCardIcon } from "lucide-react";
import { CreditsCards } from "@/@types";

import CreditCardFormComponent from "./_components/CreditCardForm";
import CreditCardsList from "./_components/CreditCardsList";

export default function CreditCards() {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creditCards, setCreditCards] = useState<CreditsCards[]>([]);
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

  const handleOpenCard = (id: number) => {
    setOpenCardId(id);
  };

  const handleCloseCard = () => {
    setOpenCardId(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <main className="px-4">
      <div className="w-full mt-4 flex justify-center">
        <button
          className="h-10 flex-1 bg-blue-500 text-white rounded-md flex flex-row justify-center items-center gap-2 focus:ring-2 focus:ring-blue-400 focus:outline"
          onClick={() => setShowForm(!showForm)}
        >
          <CreditCardIcon strokeWidth={1.5} size={20} />
          <span>{showForm ? "Cancelar" : "Adicionar Cartão"}</span>
        </button>
      </div>

      {showForm && <CreditCardFormComponent onClose={handleCloseForm} onSuccess={fetchCreditCards} />}

      {error && <p className="w-full text-center text-sm text-red-500 mt-2">{error}</p>}

      <CreditCardsList creditCards={creditCards} loading={loading} openCardId={openCardId} onOpen={handleOpenCard} onClose={handleCloseCard} onDelete={handleDeleteCreditCard} />
    </main>
  );
}
