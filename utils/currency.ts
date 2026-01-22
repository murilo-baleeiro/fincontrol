// Masks currency input as user types (for input fields)
export function maskCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  const number = Number(digits) / 100;

  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Formats a number as currency for display (with R$ symbol)
export function formatCurrencyDisplay(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Parses a formatted currency string back to a number
export function parseCurrency(value: string): number {
  return Number(value.replace(/\./g, "").replace(",", "."));
}