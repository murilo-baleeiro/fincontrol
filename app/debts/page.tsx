import GroupDown from "@/components/UI/GroupDown";
import { CalendarSync, Coins, CreditCard, FilePen } from "lucide-react";

export default function Debts() {
  return (
    <main className="p-2 space-y-2">
      <GroupDown
        title={
          <p className="flex flex-row gap-2 items-center">
            <Coins strokeWidth={1} size={20} />
            <span>Despesas Fixas</span>
          </p>
        }
      >
        <p>Minhas despesas fixas</p>
      </GroupDown>

      <GroupDown
        title={
          <p className="flex flex-row gap-2 items-center">
            <CalendarSync strokeWidth={1} size={20} />
            <span>Mensalidades</span>
          </p>
        }
      >
        <p>Minhas mensalidades</p>
      </GroupDown>

      <GroupDown
        title={
          <p className="flex flex-row gap-2 items-center">
            <CreditCard strokeWidth={1} size={20} />
            <span>Faturas de Cartão</span>
          </p>
        }
      >
        <p>Minhas faturas de cartão</p>
      </GroupDown>

      <GroupDown
        title={
          <p className="flex flex-row gap-2 items-center">
            <FilePen strokeWidth={1} size={20} />
            <span>Assinaturas</span>
          </p>
        }
      >
        <p>Minhas assinaturas</p>
      </GroupDown>
    </main>
  );
}
