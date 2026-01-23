"use client";

import { CreditsCards } from "@/@types";
import CreditCardsCard from "@/components/UI/CreditCardsCard";

interface CreditCardsListProps {
  creditCards: CreditsCards[];
  loading: boolean;
  openCardId: number | null;
  onOpen: (id: number) => void;
  onClose: () => void;
  onDelete: (id: number) => void;
  onEdit: (card: CreditsCards) => void;
}

export default function CreditCardsList({ creditCards, loading, openCardId, onOpen, onClose, onDelete, onEdit }: CreditCardsListProps) {
  if (loading) {
    return <p className="w-full text-center text-sm text-gray-500 mt-2">Carregando...</p>;
  }

  if (creditCards.length === 0) {
    return <p className="w-full text-center text-sm text-gray-500 mt-2">Nenhum cartão encontrado.</p>;
  }

  return (
    <section className="mt-4 space-y-4 overflow-y-scroll h-[80vh] pb-28">
      <ul className="flex flex-col gap-4">
        {creditCards.map((creditCard) => (
          <CreditCardsCard
            key={creditCard.id}
            isOpen={openCardId === creditCard.id}
            onOpen={onOpen}
            onClose={onClose}
            onDelete={onDelete}
            onEdit={onEdit}
            creditCardData={creditCard}
          />
        ))}
      </ul>
    </section>
  );
}
