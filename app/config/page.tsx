"use client"

import Input from "@/components/UI/Input";
import GroupConfig from "./_components/GroupConfig";
import Button from "@/components/UI/Button";
import { Minus } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface Categories {
  id: number,
  name: string
}

export default function Confif() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [form, setForm] = useState({
    name: ""
  });

  async function fetchCategories() {
    try {
      const response = await fetch("/api/configs/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);


  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmitForm(e: FormEvent) {
    e.preventDefault();

    if (!form.name) {
      alert("Forneça um nome válido");
      return;
    }

    const payload = {
      ...form,
    };

    const response = await fetch("/api/configs/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      fetchCategories();
    } else {
      alert("Erro ao criar categoria");
    }
  }

  // async function handleDeleteCategory(id: number) {
  //   const response = await fetch(`/api/configs/categories/${id}`, {
  //     method: "DELETE",
  //   });

  //   if (!response.ok) {
  //     alert("Erro ao remover categoria");
  //     return;
  //   }

  //   // Atualiza a lista sem recarregar a página
  //   setCategories((prev) => prev.filter((cat) => cat.id !== id));
  // }

  async function handleDeleteCategory(id: number) {
    try {
      const response = await fetch(`/api/configs/categories?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        alert("Erro ao remover categoria");
        return;
      }
      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  return (
    <main className="px-4 mt-4">
      <GroupConfig title="Categorias">
        <form className="flex flex-row gap-2 items-end justify-between border-t border-gray-200 pt-2" onSubmit={handleSubmitForm}>
          <Input name="name" value={form.name} onChange={handleChangeInput} />
          <Button type="submit" className="flex-1 py-1">
            Adicionar
          </Button>
        </form>
        <section className="mt-4">
          <h1>Categorias disponíveis:</h1>
          <ul className="mt-1 divide-y divide-gray-200">
            {
              categories.map(({ id, name }) => (
                <li key={id} className="p-2 flex flex-row justify-between items-center">
                  <span>{id}. {name}</span>
                  <button onClick={() => handleDeleteCategory(id)}>
                    <Minus className="text-red-500" />
                  </button>
                </li>
              ))
            }
          </ul>
        </section>
      </GroupConfig>
    </main>
  );
}
