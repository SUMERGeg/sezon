import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = { ...pageMetadata("/cart", "Корзина"), robots: { index: false, follow: false } };

export default function CartPage() {
  return (
    <section className="container page-section cart-page"><p className="eyebrow">Ваш выбор</p><h1>Корзина</h1><p className="cart-intro">Букеты, размеры и маленькие дополнения. Демонстрация магазина — заказ и оплата не выполняются.</p><CartView /></section>
  );
}
