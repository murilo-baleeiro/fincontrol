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
  const {
    today,
    formData,
    categories,
    openCardId,
    creditCards,
    transactions,
    setFormData,
    handleSubmit,
    handleDelete,
    handleChange,
    setOpenCardId,
  } = useTransactions();

  const inboundCategories = categories ? categories.inbound : [];
  const outboundCategories = categories ? categories.outbound : [];
  const paymentsCategories = categories ? categories.payments : [];
  const creditCardsOptions = creditCards ? creditCards : [];

  return (
    <>
      <StretchForm
        onSubmit={handleSubmit}
        buttons="transactions"
        buttonsActions={{
          inbound: () => setFormData({ ...formData, action: "inbound" }),
          outbound: () => setFormData({ ...formData, action: "outbound" }),
        }}
      >
        <Input
          type="text"
          name="description"
          label="Descrição da Transação:"
          placeholder="Ex.: Mercado, Compra"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="value"
          label="Valor da Transação:"
          placeholder="R$ 0,00"
          inputMode="numeric"
          onChange={handleChange}
          required
        />
        <Input
          type="date"
          name="date"
          label="Data da Transação:"
          placeholder="DD/MM/AAAA"
          max={today}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.currentTarget.value })}
          required
        />
        <ComboBox
          name="category"
          options={formData.action == "inbound" ? inboundCategories : outboundCategories}
          label="Categoria:"
          value={formData.category}
          onChange={(id) => setFormData({ ...formData, category: parseInt(id) })}
        />
        {formData.action == "outbound" && (
          <ComboBox
            name="payment"
            options={paymentsCategories}
            label="Método de Pagamento:"
            value={formData.payment}
            onChange={(id) => setFormData({ ...formData, payment: parseInt(id) })}
          />
        )}
        {paymentsCategories.find((payment) => payment.name.toLocaleLowerCase().replace("é", "e") === "credito")?.id ===
          formData.payment && (
          <ComboBox
            name="creditCards"
            options={creditCardsOptions}
            label="Cartão:"
            value={formData.creditcard}
            onChange={(id) => setFormData({ ...formData, creditcard: parseInt(id) })}
          />
        )}
      </StretchForm>
      <ScrollableList>
        {transactions && transactions.length > 0 ? (
          transactions.map(({ id, description, value, action, date, category, payment, creditcard, created_at }) => (
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
                <div className="flex flex-col gap-1 flex-1">
                  <p className="font-medium pb-0.5 flex-1">{description}</p>
                  {/* <p className="text-xs text-gray-500">{`${category ? category : ""} ${payment ? `pago com ${payment}` : ""} ${creditcard ? `${creditcard}` : ""}`}</p> */}
                  <p className="text-xs text-gray-500">{displayDate(date)}</p>
                </div>
                <p className={`font-medium ${action === "inbound" ? "text-green-500" : "text-red-500"}`}>
                  R$ {value.toFixed(2).replace(".", ",")}
                </p>
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
