"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { applyMoneyMask } from "@/utils";

import Input from "@/components/UI/Input";
import CardItem from "@/components/UI/CardItem";
import StretchForm from "@/components/UI/StretchForm";
import ScrollableList from "@/components/UI/ScrollableList";
import useMonthly from "./_useMonthly";
import SwitchBox from "@/components/UI/SwitchBox";

export default function MonthlyPage() {
  const { openCardId, setOpenCardId, monthlyData, handleSubmit, handleDelete, handleToggle } = useMonthly();

  return (
    <>
      <StretchForm onSubmit={handleSubmit}>
        <Input type="text" name="name" label="Nome da Mensalidade:" placeholder="Ex.: Aluguel, Internet" required />
        <Input type="text" name="value" label="Valor da Mensalidade:" placeholder="R$ 0,00" inputMode="numeric" onChange={applyMoneyMask} required />
        <Input type="number" name="payday" label="Dia de Pagamento:" placeholder="Ex.: 10, 12" inputMode="numeric" step={1} max={31} required />
      </StretchForm>
      <ScrollableList>
        {monthlyData && monthlyData.length > 0 ? (
          monthlyData.map(({ id, name, value, payday, active }) => (
            <CardItem id={id} key={id} isOpen={openCardId === id} onOpen={(id) => setOpenCardId(id)} onClose={() => setOpenCardId(null)} onDelete={(id) => handleDelete(id)}>
              <div className="w-full flex flex-row justify-start gap-4 items-center">
                <SwitchBox checked={active} onSwitch={() => handleToggle(id, !active)} />
                <div className="flex flex-col gap-2">
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-gray-500">Vencimento Dia: {payday}</p>
                </div>
                <p className="font-medium flex-1 text-right">R$ {value.toFixed(2).replace(".", ",")}</p>
              </div>
            </CardItem>
          ))
        ) : (
          <p className="text-center">Nenhuma mensalidade cadastrada.</p>
        )}
      </ScrollableList>
    </>
  );
}
