import type { Occasion, Palette, Product, ProductCategory } from "../../data/schemas";
import { getStartingPrice } from "./selectors";

export type CatalogSort = "recommended" | "price-asc" | "price-desc" | "newest";
export type CatalogFilters = {
  categories?: ProductCategory[];
  occasions?: Occasion[];
  palettes?: Palette[];
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
};
export type CatalogQuery = Record<string, string | string[] | undefined>;

export function filterProducts(products: readonly Product[], filters: CatalogFilters) {
  return products.filter((product) => {
    if (filters.categories?.length && !filters.categories.includes(product.category)) return false;
    if (filters.occasions?.length && !product.occasionTags.some((tag) => filters.occasions!.includes(tag))) return false;
    return product.variants.some((variant) => {
      const palettes = variant.palette ? [variant.palette] : product.paletteTags;
      if (filters.palettes?.length && !palettes.some((palette) => filters.palettes!.includes(palette))) return false;
      if (filters.minPrice !== undefined && variant.price.amount < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && variant.price.amount > filters.maxPrice) return false;
      return !filters.availableOnly || variant.demoStock > 0;
    });
  });
}

export function sortProducts(products: readonly Product[], sort: CatalogSort) {
  const result = [...products];
  if (sort === "newest") return result.reverse();
  if (sort === "price-asc" || sort === "price-desc") {
    result.sort((a, b) => (getStartingPrice(a).amount - getStartingPrice(b).amount) * (sort === "price-asc" ? 1 : -1));
  }
  return result;
}

const categoryParams: Record<string, ProductCategory> = { author: "AUTHOR_BOUQUET", mono: "MONO_BOUQUET", arrangement: "ARRANGEMENT", seasonal: "SEASONAL_BUNCH" };
const occasionParams: Record<string, Occasion> = { birthday: "BIRTHDAY", date: "DATE", "thank-you": "THANK_YOU", home: "HOME", "just-because": "JUST_BECAUSE" };
const paletteParams: Record<string, Palette> = { light: "LIGHT", "pink-wine": "PINK_WINE", "green-white": "GREEN_WHITE", warm: "WARM", bright: "BRIGHT" };

function readGroup<T extends string>(raw: string | string[] | undefined, values: Record<string, T>) {
  return [...new Set((Array.isArray(raw) ? raw : raw ? [raw] : []).flatMap((value) => Object.hasOwn(values, value) ? [values[value]] : []))];
}

function readPrice(raw: string | string[] | undefined) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || !/^\d+$/.test(value)) return undefined;
  const amount = Number(value) * 100;
  return Number.isSafeInteger(amount) ? amount : undefined;
}

export function parseCatalogQuery(query: CatalogQuery): CatalogFilters & { sort: CatalogSort } {
  const categories = readGroup(query.category, categoryParams);
  const occasions = readGroup(query.occasion, occasionParams);
  const palettes = readGroup(query.palette, paletteParams);
  const minPrice = readPrice(query.minPrice);
  const maxPrice = readPrice(query.maxPrice);
  const rawSort = Array.isArray(query.sort) ? query.sort[0] : query.sort;
  const sort: CatalogSort = rawSort === "price-asc" || rawSort === "price-desc" || rawSort === "newest" ? rawSort : "recommended";
  return {
    ...(categories.length ? { categories } : {}),
    ...(occasions.length ? { occasions } : {}),
    ...(palettes.length ? { palettes } : {}),
    ...(minPrice !== undefined ? { minPrice } : {}),
    ...(maxPrice !== undefined ? { maxPrice } : {}),
    ...(query.available === "true" ? { availableOnly: true } : {}),
    sort,
  };
}
