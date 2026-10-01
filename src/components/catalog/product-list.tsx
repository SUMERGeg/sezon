import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/schemas";
import { getStartingPrice } from "@/domain/catalog/selectors";
import { categoryLabels } from "@/domain/catalog/labels";
import { formatMoney } from "@/lib/money";

export function ProductList({ products, prioritizeFirst = false }: { products: readonly Product[]; prioritizeFirst?: boolean }) {
  return (
    <ul className="product-grid" aria-label="Букеты и композиции">
      {products.map((product, index) => (
        <li key={product.id}>
          <Link href={`/shop/${product.slug}`} className="product-card">
            <div className="product-card-media"><Image src={product.images[0].src} alt="" width={product.images[0].width} height={product.images[0].height} sizes="(max-width: 767px) calc(50vw - 28px), (max-width: 1000px) 42vw, 25vw" loading={prioritizeFirst && index === 0 ? "eager" : "lazy"} fetchPriority={prioritizeFirst && index === 0 ? "high" : undefined} /></div>
            <p className="product-category">{categoryLabels[product.category]}</p>
            <h2>{product.name}</h2>
            <p className="product-price">{product.variants.length > 1 ? "от " : ""}{formatMoney(getStartingPrice(product))}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
