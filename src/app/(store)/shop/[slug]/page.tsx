import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog } from "@/data/catalog";
import { getProductBySlug } from "@/domain/catalog/selectors";
import { categoryLabels } from "@/domain/catalog/labels";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductOptions } from "@/components/product/product-options";
import { pageMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return catalog.products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(catalog.products, (await params).slug);
  if (!product) notFound();
  return pageMetadata(`/shop/${product.slug}`, product.name, `${product.shortDescription} Демонстрационный каталог «СЕЗОН».`);
}

export default async function ProductPage({ params }: Props) {
  const product = getProductBySlug(catalog.products, (await params).slug);
  if (!product) notFound();
  return (
    <section className="container page-section">
      <Link className="text-link breadcrumb" href="/shop">Все букеты</Link>
      <div className="product-detail">
        <ProductGallery images={product.images} />
        <div className="product-summary">
          <p className="eyebrow">{categoryLabels[product.category]}</p>
          <h1>{product.name}</h1>
          <p className="page-description">{product.description}</p>
          <ProductOptions product={product} />
          <p className="seasonal-disclosure">{product.seasonalNote}</p>
          <Link className="text-link" href="/delivery-care">Доставка и уход <span aria-hidden="true">↗</span></Link>
          <ul className="product-collections" aria-label="Коллекции товара">{catalog.collections.filter((collection) => product.collectionIds.includes(collection.id)).map((collection) => <li key={collection.id}><Link href={`/collections/${collection.slug}`}>{collection.name}</Link></li>)}</ul>
        </div>
      </div>
    </section>
  );
}
