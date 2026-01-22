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

export default function PaymentCategoriesForm() {
  const [form, setForm] = useState({ name: "" });
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpenId, setConfirmOpenId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/payments");
      if (!response.ok) throw new Error();

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setError("Erro ao carregar categorias.");
      setCategories([]);
    } finally {
      setLoading(false);
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
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error();

      setForm({ name: "" });
      fetchCategories();
    } catch {
      setError("Erro ao criar categoria.");
    }
  }

  async function handleDeleteCategory(id: number) {
    try {
      const response = await fetch(`/api/payments?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      fetchCategories();
    } catch {
      setError("Erro ao deletar categoria.");
    } finally {
      setConfirmOpenId(null);
    }
  }

  return (
    <main className="px-4 mt-4">
      <GroupDown title="Categorias de Pagamento">
        <form className="flex flex-row gap-2 items-end justify-between border-t border-gray-200 pt-2" onSubmit={handleSubmitForm}>
          <Input name="name" placeholder="Nome da categoria" value={form.name} onChange={handleChangeInput} />
          <Button type="submit" className="flex-1 py-1">
            Adicionar
          </Button>
        </form>

        <section className="mt-4">
          {loading && <p className="w-full text-center text-sm text-gray-500 mt-2">Carregando...</p>}
          {!loading && error && <p className="w-full text-center text-sm text-red-500 mt-2">{error}</p>}
          {!loading && !error && categories.length === 0 && <p className="w-full text-center text-sm text-gray-500 mt-2">Nenhuma categoria encontrada.</p>}
          {!loading && !error && (
            <ul className="mt-1 divide-y divide-gray-200">
              {categories.map(({ id, name }, _index) => (
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
              ))}
            </ul>
          )}
        </section>
      </GroupDown>
    </main>
  );
}
