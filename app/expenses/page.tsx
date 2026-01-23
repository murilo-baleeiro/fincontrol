import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";

export default function Debts() {
  return (
    <main className="p-4">
      <form className="flex flex-col gap-2">
        <Input label="Despesa:" name="name" placeholder="Ex.: Aluguel, Internet" />
        <Input label="Valor:" inputMode="numeric" placeholder="R$ 0,00" />
        <Input label="Vencimento:" name="due_day" type="number" placeholder="Ex.: 20" min="1" max="31" />
        <Button className="mt-2">Salvar</Button>
      </form>
    </main>
  );
}
