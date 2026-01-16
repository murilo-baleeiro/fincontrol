import { CircleArrowDown, CircleArrowUp } from "lucide-react";

interface TransactionCardProps {
  action: "inbound" | "outbound";
  title: string;
  date: string;
  value: number;
}

export default function TransactionCard({ action, title, date, value }: TransactionCardProps) {
  return (
    <div className="relative border border-gray-200 shadow rounded p-4 flex flex-row gap-4 justify-start items-center">
      {action == "inbound" ? (
        <CircleArrowDown strokeWidth={1} size={36} className="text-emerald-500" />
      ) : (
        <CircleArrowUp strokeWidth={1} size={36} className="text-red-500" />
      )}
      <div className="w-full flex flex-row justify-between items-center">
        <div>
          <p>{title}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
        <p className={`font-semibold ${action == "outbound" ? "text-red-500" : "text-emerald-500"}`}>
          {action == "outbound" ? "-" : "+"}R$ {value}
        </p>
      </div>
    </div>
  );
}
