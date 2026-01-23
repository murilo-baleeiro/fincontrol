import { formatCurrencyDisplay } from "@/utils";

export default function TopCCUsageCard({creditCards}: {creditCards: { id: number; name: string; card_limit: number; spent: number }[]}) {
    return (
        <div className="w-full rounded-lg bg-red-700 p-4 text-white shadow-md">
        <h2 className="text-sm font-light">Cartões de Crédito:</h2>
        <div className="mt-4 space-y-3">
          {creditCards.length > 0 ? (
            creditCards.map((card) => (
              <div key={card.id}>
                <div className="flex items-center justify-between text-sm">
                  <p className="flex flex-row gap-1">
                    <span className="font-light">{card.name}</span>
                    <span className="font-semibold">{formatCurrencyDisplay(card.spent)}</span>
                  </p>
                  <p className="font-semibold">Limite: {formatCurrencyDisplay(card.card_limit)}</p>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-white/30">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{
                      width: `${(card.spent / card.card_limit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm font-light text-red-100">Nenhum cartão de crédito cadastrado.</div>
          )}
        </div>
      </div>
    );
}