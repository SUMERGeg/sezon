import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata("/about", "О проекте");

export default function AboutPage() {
  return (
    <PageIntro eyebrow="О проекте" title="Собрано вокруг сезона" description="«СЕЗОН» — концепция небольшой цветочной мастерской. Букет здесь выбирают по форме, цвету и настроению.">
      <div className="text-section"><h2>Цветы и понятный выбор</h2><p>Идея проекта — соединить спокойную журнальную подачу с ясным сценарием выбора букета: размер, состав, гамма и цена.</p><p>Это работа для портфолио. Ассортимент и условия будут демонстрационными; реальные заказы и оплата не выполняются.</p></div>
    </PageIntro>
  );
}
