"use client";

import TransactionCard from "@/app/transactions/_components/TransactionCard";
import TransactionCardSkeleton from "@/app/transactions/_components/TransactionCardSkeleton";

interface Transaction {
  id: number;
  action: "inbound" | "outbound";
  description: string;
  value: number;
  date: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  openCardId: number | null;
  onOpen: (id: number) => void;
  onClose: () => void;
  onDelete: (id: number) => void;
  onLoadMore: () => void;
}

export default function TransactionsList({ transactions, loading, error, openCardId, onOpen, onClose, onDelete, onLoadMore }: TransactionsListProps) {
  return (
    <section className="mt-4 space-y-4 overflow-y-scroll h-[80vh] pb-28">
      {loading && Array.from({ length: 6 }).map((_, index) => <TransactionCardSkeleton key={index} />)}
      {!loading && error && <p className="text-center text-sm text-red-500">{error}</p>}
      {!loading && !error && transactions.length === 0 && <p className="text-center text-sm text-gray-500">Nenhuma transação encontrada.</p>}
      {!loading &&
        !error &&
        transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} isOpen={openCardId === transaction.id} onOpen={onOpen} onClose={onClose} onDelete={onDelete} />
        ))}
      {transactions.length > 0 && (
        <button className="w-full text-gray-300" onClick={onLoadMore}>
          Ver mais
        </button>
      )}
    </section>
  );
}
