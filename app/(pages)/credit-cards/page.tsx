"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { applyMoneyMask } from "@/utils";

import Input from "@/components/UI/Input";
import CardItem from "@/components/UI/CardItem";
import StretchForm from "@/components/UI/StretchForm";
import ScrollableList from "@/components/UI/ScrollableList";
import { CreditCardIcon } from "lucide-react";

interface CreditCardData {
    id: number;
    name: string;
    cardlimit: number;
    payday: number;
}

export default function CreditCardsPage() {

    const [openCardId, setOpenCardId] = useState<number | null>(null);
    const [creditCardData, setCreditCardData] = useState<CreditCardData[] | null>(null);

    useEffect(() => {
        fetchCreditCardData.current();
    }, []);

    const fetchCreditCardData = useRef(async () => {
        try {
            const response = await fetch("/api/credit-cards");
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched Credit Card Data:", data);
                setCreditCardData(data);
            } else {
                console.error("Failed to fetch credit card data.");
            }
        } catch (error) {
            console.error("Error fetching credit card data:", error);
        }
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const [name, cardlimit, payday] = [
            formData.get("name") as string,
            parseFloat((formData.get("cardlimit") as string).replace(/\./g, "").replace(",", ".")),
            parseInt(formData.get("payday") as string, 10),
        ];

        console.log("Credit Card Data:", { name, cardlimit, payday });

        fetch("/api/credit-cards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, cardlimit, payday }),
        }).then((response) => {
            if (response.ok) {
                console.log("Credit card data submitted successfully!");
                e.currentTarget.reset();
            } else {
                console.error("Failed to submit credit card data.");
            }
        }).finally(() => {
            console.log("Submission attempt completed.");
            fetchCreditCardData.current();
        });
    };

    const handleDelete = (id: number) => {
        fetch(`/api/credit-cards?id=${id}`, {
            method: "DELETE",
        }).then((response) => {
            if (response.ok) {
                console.log(`Credit card entry #${id} deleted successfully!`);
                fetchCreditCardData.current();
            } else {
                console.error(`Failed to delete credit card entry #${id}.`);
            }
        }
        ).finally(() => {
            console.log("Deletion attempt completed.");
        });
    };

    return (
        <>
            <StretchForm onSubmit={handleSubmit}>
                <Input type="text" name="name" label="Nome do Cartão:" placeholder="Ex.: Visa, MasterCard" required />
                <Input type="text" name="cardlimit" label="Limite do Cartão:" placeholder="R$ 0,00" inputMode="numeric" onChange={applyMoneyMask} required />
                <Input type="number" name="payday" label="Dia de Vencimento:" placeholder="Ex.: 10, 12" inputMode="numeric" step={1} max={31} required />
            </StretchForm>
            <ScrollableList>
                {creditCardData && creditCardData.length > 0 ? (
                    creditCardData.map((creditCard, index) => (
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
                                <p className="font-medium">
                                    R$ {creditCard.cardlimit.toFixed(2).replace(".", ",")}
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
