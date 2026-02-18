import { useState, useEffect, useRef, FormEvent } from "react";

interface CreditCardData {
  id: number;
  name: string;
  cardlimit: number;
  payday: number;
}

export default function useCreditCards() {
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
    })
      .then((response) => {
        if (response.ok) {
          console.log("Credit card data submitted successfully!");
          e.currentTarget.reset();
        } else {
          console.error("Failed to submit credit card data.");
        }
      })
      .finally(() => {
        console.log("Submission attempt completed.");
        fetchCreditCardData.current();
      });
  };

  const handleDelete = (id: number) => {
    fetch(`/api/credit-cards?id=${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Credit card entry #${id} deleted successfully!`);
          fetchCreditCardData.current();
        } else {
          console.error(`Failed to delete credit card entry #${id}.`);
        }
      })
      .finally(() => {
        console.log("Deletion attempt completed.");
      });
  };

  return {
    openCardId,
    setOpenCardId,
    creditCardData,
    handleSubmit,
    handleDelete,
  };
}
