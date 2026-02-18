"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { applyMoneyMask, displayDate } from "@/utils";

import Input from "@/components/UI/Input";
import CardItem from "@/components/UI/CardItem";
import StretchForm from "@/components/UI/StretchForm";
import ScrollableList from "@/components/UI/ScrollableList";
import useTransactions from "./_useTransactions";
import ComboBox from "@/components/UI/ComboBox";

export default function TransactionsPage() {
  const { today, date, action, category, categories, openCardId, transactionData, setAction, handleSubmit, handleDelete, setDate, setOpenCardId, setCategory } = useTransactions();

  const inboundCategories = categories ? categories.inbound : [];
  const outboundCategories = categories ? categories.outbound : [];
  const paymentsCategories = categories ? categories.payments : [];

  return (
    <>
      <StretchForm onSubmit={handleSubmit} buttons="transactions" buttonsActions={{ inbound: () => setAction("inbound"), outbound: () => setAction("outbound") }}>
        <Input type="text" name="description" label="Descrição da Transação:" placeholder="Ex.: Mercado, Compra" required />
        <Input type="text" name="value" label="Valor da Transação:" placeholder="R$ 0,00" inputMode="numeric" onChange={applyMoneyMask} required />
        <Input
          type="date"
          name="date"
          label="Data da Transação:"
          placeholder="Ex.: 2024-06-15"
          max={today}
          value={date}
          onChange={(e) => setDate(e.currentTarget.value)}
          required
        />
        <ComboBox
          name="category"
          options={action == "inbound" ? inboundCategories : outboundCategories}
          label="Categoria:"
          value={category}
          onChange={(id) => setCategory(parseInt(id))}
        />
        {action == "outbound" && <ComboBox name="payments" options={paymentsCategories} label="Pagamentos:" value={category} onChange={(id) => setCategory(parseInt(id))} />}
      </StretchForm>
      <ScrollableList>
        {transactionData && transactionData.length > 0 ? (
          transactionData.map(({ id, description, value, date, action }) => (
            <CardItem
              id={id}
              key={id}
              action={action}
              isOpen={openCardId === id}
              onOpen={(id) => setOpenCardId(id)}
              onClose={() => setOpenCardId(null)}
              onDelete={(id) => handleDelete(id)}
            >
              <div className="w-full flex flex-row justify-between items-center">
                <div className="flex flex-col gap-2">
                  <p className="font-medium">{description}</p>
                  <p className="text-sm text-gray-500">{displayDate(date)}</p>
                </div>
                <p className={`font-medium ${action === "inbound" ? "text-green-500" : "text-red-500"}`}>R$ {value.toFixed(2).replace(".", ",")}</p>
              </div>
            </CardItem>
          ))
        ) : (
          <p className="text-center">Nenhuma transação cadastrada.</p>
        )}
      </ScrollableList>
    </>
  );
}
