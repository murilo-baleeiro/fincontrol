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

export default function PaymentsGroup() {
  const [form, setForm] = useState({ name: "" });
  const [categories, setCategories] = useState<Categories[]>([]);
  const [confirmOpenId, setConfirmOpenId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories/payments", { credentials: "include" });
      if (!response.ok) throw new Error();

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      alert("Erro ao carregar categorias.");
      setCategories([]);
    }
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmitForm(e: FormEvent) {
    e.preventDefault();

    if (!form.name) return;

    try {
      const response = await fetch("/api/categories/payments", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error();

      setForm({ name: "" });
      fetchCategories();
    } catch {
      alert("Erro ao criar categoria.");
    }
  }

  async function handleDeleteCategory(id: number) {
    try {
      const response = await fetch(`/api/categories/payments?id=${id}`, {
        credentials: "include",
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      fetchCategories();
    } catch {
      alert("Erro ao deletar categoria.");
    } finally {
      setConfirmOpenId(null);
    }
  }

  return (
    <main>
      <GroupDown title="Categorias de Pagamentos">
        <form className="flex flex-row gap-2 items-end justify-between border-t border-gray-200 pt-2" onSubmit={handleSubmitForm}>
          <Input name="name" placeholder="Ex.: Pix, Dinheiro" value={form.name} onChange={handleChangeInput} />
          <Button type="submit" className="flex-1 h-8.5">
            Adicionar
          </Button>
        </form>

        <section className="mt-4">
          <ul className="mt-1 divide-y divide-gray-200">
            {categories && categories.length > 0 ? (
              categories.map(({ id, name }, _index) => (
                <li key={id} className="p-2 flex flex-row justify-between items-center">
                  <span>
                    {_index + 1}. {name}
                  </span>
                  <div className="relative w-16 h-6">
                    <Minus
                      className={`absolute right-0 text-red-500 transition-all duration-200 ${
                        confirmOpenId === id ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
                      }`}
                      onClick={() => setConfirmOpenId(id)}
                    />
                    <div
                      className={`absolute right-0 flex gap-4 transition-all duration-200 ${
                        confirmOpenId === id ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
                      }`}
                    >
                      <Check className="text-emerald-500" onClick={() => handleDeleteCategory(id)} />
                      <X className="text-red-500" onClick={() => setConfirmOpenId(null)} />
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="w-full text-center text-gray-500">Nenhuma categoria cadastrada.</p>
            )}
          </ul>
        </section>
      </GroupDown>
    </main>
  );
}
