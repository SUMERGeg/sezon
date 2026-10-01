import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { catalog } from "@/data/catalog";
import { getCollectionBySlug, getCollectionProducts } from "@/domain/catalog/selectors";
import { ProductList } from "@/components/catalog/product-list";
import { pageMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return catalog.collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = getCollectionBySlug(catalog.collections, (await params).slug);
  if (!collection) notFound();
  return pageMetadata(`/collections/${collection.slug}`, collection.name, `${collection.intro} Демонстрационная коллекция «СЕЗОН».`);
}

export default async function CollectionPage({ params }: Props) {
  const collection = getCollectionBySlug(catalog.collections, (await params).slug);
  if (!collection) notFound();
  return (
    <section className="container page-section">
      <Link className="text-link breadcrumb" href="/shop#collections">Все коллекции</Link>
      <p className="eyebrow">Коллекция · концепт</p>
      <h1>{collection.name}</h1>
      <p className="page-description">{collection.intro}</p>
      <p className="demo-caption">Все цены и наличие — демонстрационные.</p>
      <div className="collection-banner"><Image src={collection.heroImage.src} alt={collection.heroImage.alt} width={collection.heroImage.width} height={collection.heroImage.height} sizes="90vw" /></div>
      <ProductList products={getCollectionProducts(catalog.products, collection)} />
    </section>
  );
}
