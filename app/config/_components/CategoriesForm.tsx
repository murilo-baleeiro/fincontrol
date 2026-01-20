"use client";

import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import GroupDown from "@/components/UI/GroupDown";

import { Check, Minus, X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface Categories {
  id: number;
  name: string;
}

export default function CategoriesForm() {
  const [form, setForm] = useState({ name: "" });
  const [categories, setCategories] = useState<Categories[]>([]);
  const [confirmOpenId, setConfirmOpenId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch("/api/configs/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

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
      setForm({ name: "" });
    } else {
      alert("Erro ao criar categoria");
    }
  }

  async function handleDeleteCategory(id: number) {
    try {
      const response = await fetch(`/api/configs/categories?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        alert("Erro ao deletar categoria");
        return;
      }
      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
    setConfirmOpenId(null);
  }

  const handleOpenConfirm = (id: number) => {
    setConfirmOpenId(id);
  };

  const handleCancelConfirm = () => {
    setConfirmOpenId(null);
  };

  return (
    <main className="px-4 mt-4">
      <GroupDown title="Categorias">
        <form className="flex flex-row gap-2 items-end justify-between border-t border-gray-200 pt-2" onSubmit={handleSubmitForm}>
          <Input name="name" placeholder="Nome da categoria" value={form.name} onChange={handleChangeInput} />
          <Button type="submit" className="flex-1 py-1">
            Adicionar
          </Button>
        </form>
        <section className="mt-4">
          <h1>Categorias disponíveis:</h1>
          <ul className="mt-1 divide-y divide-gray-200">
            {categories.map(({ id, name }) => (
              <li key={id} className="p-2 flex flex-row justify-between items-center">
                <span>
                  {id}. {name}
                </span>
                <div className="relative w-16 h-6">
                  <Minus
                    className={`absolute right-0 text-red-500 transition-all duration-200 ${confirmOpenId === id ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"}`}
                    onClick={() => handleOpenConfirm(id)}
                  />
                  <div
                    className={`absolute right-0 flex gap-4 transition-all duration-200 ${confirmOpenId === id ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}
                  >
                    <Check className="text-emerald-500" onClick={() => handleDeleteCategory(id)} />
                    <X className="text-red-500" onClick={handleCancelConfirm} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </GroupDown>
    </main>
  );
}
