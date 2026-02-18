export function displayDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString("pt-BR", {
    month: "short",
  });

  return `${day} de ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}
