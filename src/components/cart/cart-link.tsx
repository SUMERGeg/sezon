"use client";

import Link from "next/link";
import { useCart } from "@/store/cart-store";

export function CartLink() {
  const { items, ready } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return <Link className="cart-link" href="/cart" aria-label={ready ? `Корзина (${count})` : "Корзина — загрузка"}>Корзина <span className="cart-count" aria-hidden="true">{ready ? count : "—"}</span></Link>;
}
