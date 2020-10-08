export default function formatCurrency(number: number) {
  return Number(number)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+\b)/g, "$1 ");
}
