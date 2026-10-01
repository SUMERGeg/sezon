import type { Collection, Product } from "../../data/schemas";

export function getProductBySlug(products: readonly Product[], slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCollectionBySlug(collections: readonly Collection[], slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getVariant(product: Product, variantId: string) {
  return product.variants.find((variant) => variant.id === variantId);
}

export function getDefaultVariant(product: Product) {
  return product.variants.find((variant) => variant.demoStock > 0) ?? product.variants[0];
}

export function getStartingPrice(product: Product) {
  return product.variants.reduce((lowest, variant) => variant.price.amount < lowest.amount ? variant.price : lowest, product.variants[0].price);
}

export function getCollectionProducts(products: readonly Product[], collection: Collection) {
  const byId = new Map(products.map((product) => [product.id, product]));
  return collection.productIds.flatMap((id) => {
    const product = byId.get(id);
    return product ? [product] : [];
  });
}
