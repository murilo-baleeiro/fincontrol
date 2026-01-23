"use client";

export default function TransactionCardSkeleton() {
  return (
    <div className="relative bg-white border border-gray-200 rounded overflow-hidden animate-pulse">
      <div className="p-4 flex items-center gap-4">
        {/* Ícone */}
        <div className="w-9 h-9 rounded-full bg-gray-200" />

        <div className="w-full flex justify-between items-center">
          <div className="space-y-2">
            {/* Título */}
            <div className="h-4 w-32 bg-gray-200 rounded" />
            {/* Data */}
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>

          {/* Valor */}
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
