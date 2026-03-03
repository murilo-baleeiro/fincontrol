import { useState, useEffect, useRef, FormEvent } from "react";

interface MonthlyData {
  id: number;
  name: string;
  value: number;
  payday: number;
  active: boolean;
}

export default function useMonthly() {
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[] | null>(null);

  useEffect(() => {
    fetchMonthlyData.current();
  }, []);

  const fetchMonthlyData = useRef(async () => {
    try {
      const response = await fetch("/api/monthly", { credentials: "include" });
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
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, value, payday }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Monthly data submitted successfully!");
          e.currentTarget.reset();
        } else {
          console.error("Failed to submit monthly data.");
        }
      })
      .finally(() => {
        console.log("Submission attempt completed.");
        fetchMonthlyData.current();
      });
  };

  const handleDelete = (id: number) => {
    fetch(`/api/monthly?id=${id}`, {
      credentials: "include",
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Monthly entry #${id} deleted successfully!`);
          fetchMonthlyData.current();
        } else {
          console.error(`Failed to delete monthly entry #${id}.`);
        }
      })
      .finally(() => {
        console.log("Deletion attempt completed.");
      });
  };

  const handleToggle = (id: number, checked: boolean) => {
    fetch(`/api/monthly?id=${id}`, {
      credentials: "include",
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: checked, id }),
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Monthly entry #${id} toggled successfully!`);
          fetchMonthlyData.current();
        } else {
          console.error(`Failed to toggle monthly entry #${id}.`);
        }
      })
      .finally(() => {
        console.log("Toggle attempt completed.");
      });
  };

  return {
    openCardId,
    setOpenCardId,
    monthlyData,
    handleSubmit,
    handleDelete,
    handleToggle,
  };
}