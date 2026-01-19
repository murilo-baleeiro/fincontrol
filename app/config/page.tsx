"use client"

import Input from "@/components/UI/Input";
import GroupConfig from "./_components/GroupConfig";
import Button from "@/components/UI/Button";
import { Minus } from "lucide-react";

export default function Confif() {
  return (
    <main className="px-4 mt-4">
      <GroupConfig title="Categorias | Despesas">
        <form className="flex flex-row gap-2 items-end justify-between border-t border-gray-200 pt-2">
          <Input name="category" />
          <Button type="submit" className="flex-1">
            Adicionar
          </Button>
        </form>
        <section className="mt-4">
          <h1>Categorias disponíveis:</h1>
          <ul className="mt-1 divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index } className="p-2 flex flex-row justify-between items-center">
                <span>Categoria {index + 1}</span>
                <button>
                  <Minus className="text-red-500" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </GroupConfig>
    </main>
  );
}
