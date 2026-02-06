"use client";

import { FormEvent, useRef } from "react";

import Input from "@/components/UI/Input";
import StretchForm from "@/components/UI/StretchForm";
import ScrollableList from "@/components/UI/ScrollableList";
import CardList from "@/components/UI/CardList";
import { applyMoneyMask } from "@/utils";

export default function MonthlyPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const [name, value, payday] = [
      formData.get("name") as string,
      parseFloat((formData.get("value") as string).replace(/\./g, "").replace(",", ".")),
      parseInt(formData.get("payday") as string, 10),
    ];

    console.log("Monthly Data:", { name, value, payday });
  };

  return (
    <>
      <StretchForm onSubmit={handleSubmit}>
        <Input type="text" name="name" label="Nome da Mensalidade:" placeholder="Ex.: Aluguel, Internet" required />
        <Input type="text" name="value" label="Valor da Mensalidade:" placeholder="R$ 0,00" inputMode="numeric" onChange={applyMoneyMask} required />
        <Input type="number" name="payday" label="Dia de Pagamento:" placeholder="Ex.: 10, 12" inputMode="numeric" step={1} max={31} required />
      </StretchForm>
      <ScrollableList>
        {Array.from({ length: 12 }).map((_, index) => (
          <CardList key={Math.random()} switchMode onSwitch={(checked) => console.log(`Switch #${index} toggled:`, checked)}>
            Card #{index + 1}
          </CardList>
        ))}
      </ScrollableList>
    </>
  );
}
