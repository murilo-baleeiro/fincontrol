"use client";

import InboundCategoriesForm from "./_components/InboundCategoriesForm";
import OutboundCategoriesForm from "./_components/OutboundCategoriesForm";
import PaymentCategoriesForm from "./_components/PaymentCategoriesForm";

export default function Config() {
  return (
    <>
      <InboundCategoriesForm />
      <OutboundCategoriesForm />
      <PaymentCategoriesForm />
    </>
  );
}
