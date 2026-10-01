import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = { ...pageMetadata("/checkout", "Демонстрационное оформление"), robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <section className="container page-section checkout-page"><p className="eyebrow">Последние детали</p><h1>Оформление</h1><div className="checkout-disclosure"><strong>Демонстрация магазина. Заказ и оплата не выполняются.</strong><p>Это концептуальный проект для портфолио. Используйте тестовые данные.</p></div><CheckoutView /></section>
  );
}
