export const applyMoneyMask = (e: React.ChangeEvent<HTMLInputElement>) => {
  // Remove tudo que não é número
  let value = e.target.value.replace(/\D/g, "");

  // Converte para número e divide por 100 para obter centavos
  const numberValue = Number(value) / 100;

  // Formata como moeda brasileira
  e.target.value = numberValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function monetaryFormatting(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
