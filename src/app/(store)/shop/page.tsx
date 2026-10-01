import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { catalog } from "@/data/catalog";
import { CatalogBrowser, CatalogFallback } from "@/components/catalog/catalog-browser";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata("/shop", "Букеты");

export default function ShopPage() {
  return (
    <section className="container page-section">
      <p className="eyebrow">Каталог</p>
      <h1>Букеты и композиции</h1>
      <p className="page-description">Цветы для подарка, дома и обычного хорошего дня. Все цены и наличие — демонстрационные.</p>
      <Suspense fallback={<CatalogFallback products={catalog.products} />}><CatalogBrowser products={catalog.products} /></Suspense>
      <section id="collections" className="collections-section">
        <h2>Коллекции</h2>
        <ul className="collection-list">
          {catalog.collections.map((collection) => <li key={collection.id}><Link href={`/collections/${collection.slug}`}>{collection.name}</Link><p>{collection.intro}</p></li>)}
        </ul>
      </section>
    </section>
  );
}
