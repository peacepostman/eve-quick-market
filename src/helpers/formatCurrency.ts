export default function formatCurrency(number: number) {
  return Number(number).toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}
