"use client";

import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Auth() {
  const [acessCode, setAccessCode] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: acessCode }),
        credentials: "same-origin",
      });
      if (res.ok) {
        // authentication succeeded, redirect to home
        window.location.href = "/";
      } else {
        const text = await res.text();
        setError(text || "Código inválido");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao autenticar");
    }
  };

  return (
    <main
      className={`w-full h-screen overflow-auto pb-20 pt-12 flex flex-col gap-4 justify-center items-center ${usePathname() === "/" && "pt-15"}`}
    >
      <h1 className="text-2xl font-bold">
        <span className="text-sky-600">Fin</span>
        <span className="text-gray-800">Control</span>
      </h1>
      <form onSubmit={handleSubmit} className="w-4/5 flex flex-col gap-4">
        <Input
          type="number"
          name="access-code"
          placeholder="Informe seu código de acesso"
          className="w-full text-center"
          required
          value={acessCode}
          onChange={(e) => setAccessCode(e.target.value)}
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </main>
  );
}
