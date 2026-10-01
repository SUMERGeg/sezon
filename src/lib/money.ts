import type { Money } from "../data/schemas";

export function formatMoney(money: Money) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: money.amount % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(money.amount / 100);
}
