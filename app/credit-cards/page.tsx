"use client";

import { applyMoneyMask } from "@/utils";
import { CreditCardIcon } from "lucide-react";

import Input from "@/components/UI/Input";
import CardItem from "@/components/UI/CardItem";
import StretchForm from "@/components/UI/StretchForm";
import ScrollableList from "@/components/UI/ScrollableList";
import useCreditCards from "./_useCreditCards";

export default function CreditCardsPage() {
  const { openCardId, setOpenCardId, creditCardData, handleSubmit, handleDelete } = useCreditCards();

  return (
    <>
      <StretchForm onSubmit={handleSubmit}>
        <Input type="text" name="name" label="Nome do Cartão:" placeholder="Ex.: Visa, MasterCard" required />
        <Input type="text" name="cardlimit" label="Limite do Cartão:" placeholder="R$ 0,00" inputMode="numeric" onChange={applyMoneyMask} required />
        <Input type="number" name="payday" label="Dia de Vencimento:" placeholder="Ex.: 10, 12" inputMode="numeric" step={1} max={31} required />
      </StretchForm>
      <ScrollableList>
        {creditCardData && creditCardData.length > 0 ? (
          creditCardData.map((creditCard) => (
            <CardItem
              id={creditCard.id}
              key={creditCard.id}
              isOpen={openCardId === creditCard.id}
              onOpen={(id) => setOpenCardId(id)}
              onClose={() => setOpenCardId(null)}
              onDelete={(id) => handleDelete(id)}
            >
              <div className="w-full flex flex-row justify-between items-center">
                <CreditCardIcon className="text-blue-500 ml-2" size={30} strokeWidth={1.5} />
                <div className="flex flex-col gap-2 -ml-10 min-w-0 overflow-hidden">
                  <p className="font-medium truncate">{creditCard.name}</p>
                  <p className="text-sm text-gray-500">Vencimento Dia: {creditCard.payday}</p>
                </div>
                <p className="font-medium">R$ {creditCard.cardlimit.toFixed(2).replace(".", ",")}</p>
              </div>
            </CardItem>
          ))
        ) : (
          <p className="text-center">Nenhum cartão cadastrado.</p>
        )}
      </ScrollableList>
    </>
  );
}
