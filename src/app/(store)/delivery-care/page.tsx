import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata("/delivery-care", "Доставка и уход");

export default function DeliveryCarePage() {
  return (
    <PageIntro eyebrow="Практические детали" title="Доставка и уход" description="Несколько простых правил для букета и пояснения к демонстрации магазина.">
      <div className="text-section"><h2>Доставка в демонстрации</h2><p>В оформлении можно выбрать самовывоз без доплаты или доставку за 500 ₽. Это примеры тарифов и расписания; реальная доставка в проекте не выполняется, точка самовывоза не назначена.</p></div>
      <div className="text-section"><h2>Сезонные замены</h2><p>Отдельные сорта могут меняться в течение года. Ориентиром остаются общий характер, гамма и объём композиции.</p></div>
      <div className="text-section"><h2>Как ухаживать за букетом</h2><p>Подрежьте стебли, поставьте букет в чистую прохладную воду и обновляйте её каждый день. Держите цветы вдали от батарей и прямого солнца.</p></div>
    </PageIntro>
  );
}
