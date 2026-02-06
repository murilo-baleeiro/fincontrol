"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { applyMoneyMask } from "@/utils";

import Input from "@/components/UI/Input";
import CardItem from "@/components/UI/CardItem";
import StretchForm from "@/components/UI/StretchForm";
import ScrollableList from "@/components/UI/ScrollableList";

interface MonthlyData {
  id: number;
  name: string;
  value: number;
  payday: number;
  active: boolean;
}

export default function MonthlyPage() {

  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[] | null>(null);

  useEffect(() => {
    fetchMonthlyData.current();
  }, []);

  const fetchMonthlyData = useRef(async () => {
    try {
      const response = await fetch("/api/monthly");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Monthly Data:", data);
        setMonthlyData(data);
      } else {
        console.error("Failed to fetch monthly data.");
      }
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const [name, value, payday] = [
      formData.get("name") as string,
      parseFloat((formData.get("value") as string).replace(/\./g, "").replace(",", ".")),
      parseInt(formData.get("payday") as string, 10),
    ];

    console.log("Monthly Data:", { name, value, payday });

    fetch("/api/monthly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, value, payday }),
    }).then((response) => {
      if (response.ok) {
        console.log("Monthly data submitted successfully!");
        e.currentTarget.reset();
      } else {
        console.error("Failed to submit monthly data.");
      }
    }).finally(() => {
      console.log("Submission attempt completed.");
      fetchMonthlyData.current();
    });
  };

  const handleDelete = (id: number) => {
    fetch(`/api/monthly?id=${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        console.log(`Monthly entry #${id} deleted successfully!`);
        fetchMonthlyData.current();
      } else {
        console.error(`Failed to delete monthly entry #${id}.`);
      }
    }
    ).finally(() => {
      console.log("Deletion attempt completed.");
    });
  };

  const handleToggle = (id: number, checked: boolean) => {
    fetch(`/api/monthly?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: checked, id }),
    }).then((response) => {
      if (response.ok) {
        console.log(`Monthly entry #${id} toggled successfully!`);
        fetchMonthlyData.current();
      } else {
        console.error(`Failed to toggle monthly entry #${id}.`);
      }
    }).finally(() => {
      console.log("Toggle attempt completed.");
    });
  };

  return (
    <>
      <StretchForm onSubmit={handleSubmit}>
        <Input type="text" name="name" label="Nome da Mensalidade:" placeholder="Ex.: Aluguel, Internet" required />
        <Input type="text" name="value" label="Valor da Mensalidade:" placeholder="R$ 0,00" inputMode="numeric" onChange={applyMoneyMask} required />
        <Input type="number" name="payday" label="Dia de Pagamento:" placeholder="Ex.: 10, 12" inputMode="numeric" step={1} max={31} required />
      </StretchForm>
      <ScrollableList>
        {monthlyData && monthlyData.length > 0 ? (
          monthlyData.map((monthly, index) => (
            <CardItem
              switchMode
              initialChecked={monthly.active}
              id={monthly.id}
              key={monthly.id}
              isOpen={openCardId === monthly.id}
              onOpen={(id) => setOpenCardId(id)}
              onClose={() => setOpenCardId(null)}
              onDelete={(id) => handleDelete(id)}
              onSwitch={(checked) => handleToggle(monthly.id, checked)}
            >
              <div className="w-full flex flex-row justify-between items-center">
                <div className="flex flex-col gap-2">
                  <p className="font-medium">{monthly.name}</p>
                  <p className="text-sm text-gray-500">Vencimento Dia: {monthly.payday}</p>
                </div>
                <p className="font-medium">
                  R$ {monthly.value.toFixed(2).replace(".", ",")}
                </p>
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
