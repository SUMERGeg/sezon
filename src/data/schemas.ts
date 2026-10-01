import { z } from "zod";

export const categorySchema = z.enum(["AUTHOR_BOUQUET", "MONO_BOUQUET", "ARRANGEMENT", "SEASONAL_BUNCH"]);
export const occasionSchema = z.enum(["BIRTHDAY", "DATE", "THANK_YOU", "HOME", "JUST_BECAUSE"]);
export const paletteSchema = z.enum(["LIGHT", "PINK_WINE", "GREEN_WHITE", "WARM", "BRIGHT"]);
const text = z.string().trim().min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const positiveInteger = z.number().int().positive().max(Number.MAX_SAFE_INTEGER);
const references = z.array(slug).min(1).refine((items) => new Set(items).size === items.length, "Повторяющаяся ссылка");

export const moneySchema = z.object({ amount: positiveInteger, currency: z.literal("RUB") });
export const imageSchema = z.object({
  src: text.refine((src) => src.startsWith("/") && !src.startsWith("//"), "Нужен локальный asset"),
  alt: text,
  width: positiveInteger,
  height: positiveInteger,
  role: z.enum(["hero", "catalog", "detail", "scale", "context"]),
});

export const variantSchema = z.object({
  id: slug,
  size: z.enum(["S", "M", "L", "ONE_SIZE"]),
  sizeLabel: text,
  approximateDiameterCm: positiveInteger.optional(),
  approximateHeightCm: positiveInteger.optional(),
  palette: paletteSchema.optional(),
  price: moneySchema,
  demoStock: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
});

export const productSchema = z.object({
  id: slug,
  slug,
  name: text,
  category: categorySchema,
  collectionIds: references,
  occasionTags: z.array(occasionSchema).min(1),
  paletteTags: z.array(paletteSchema).min(1),
  shortDescription: text,
  description: text,
  seasonalNote: text.optional(),
  images: z.array(imageSchema).min(1),
  variants: z.array(variantSchema).min(1),
  featured: z.boolean().optional(),
}).superRefine((product, context) => {
  const variantIds = new Set<string>();
  product.variants.forEach((variant, index) => {
    if (variantIds.has(variant.id)) context.addIssue({ code: "custom", path: ["variants", index, "id"], message: "Повторяющийся variantId" });
    variantIds.add(variant.id);
    if (variant.palette && !product.paletteTags.includes(variant.palette)) context.addIssue({ code: "custom", path: ["variants", index, "palette"], message: "Гамма варианта отсутствует в товаре" });
  });
});

export const collectionSchema = z.object({
  id: slug,
  slug,
  name: text,
  intro: text,
  description: text.optional(),
  heroImage: imageSchema,
  productIds: references,
});

export const catalogSchema = z.object({
  products: z.array(productSchema).min(1),
  collections: z.array(collectionSchema).min(1),
}).superRefine((catalog, context) => {
  for (const group of ["products", "collections"] as const) {
    for (const field of ["id", "slug"] as const) {
      const seen = new Set<string>();
      catalog[group].forEach((item, index) => {
        if (seen.has(item[field])) context.addIssue({ code: "custom", path: [group, index, field], message: `Повторяющийся ${field}` });
        seen.add(item[field]);
      });
    }
  }
  const products = new Map(catalog.products.map((product) => [product.id, product]));
  const collections = new Map(catalog.collections.map((collection) => [collection.id, collection]));
  catalog.products.forEach((product, index) => {
    for (const id of product.collectionIds) {
      if (!collections.get(id)?.productIds.includes(product.id)) context.addIssue({ code: "custom", path: ["products", index, "collectionIds"], message: `Нет двусторонней связи с коллекцией ${id}` });
    }
  });
  catalog.collections.forEach((collection, index) => {
    for (const id of collection.productIds) {
      if (!products.get(id)?.collectionIds.includes(collection.id)) context.addIssue({ code: "custom", path: ["collections", index, "productIds"], message: `Нет двусторонней связи с товаром ${id}` });
    }
  });
});

export type Money = z.infer<typeof moneySchema>;
export type ProductImage = z.infer<typeof imageSchema>;
export type ProductVariant = z.infer<typeof variantSchema>;
export type Product = z.infer<typeof productSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type Catalog = z.infer<typeof catalogSchema>;
export type ProductCategory = z.infer<typeof categorySchema>;
export type Occasion = z.infer<typeof occasionSchema>;
export type Palette = z.infer<typeof paletteSchema>;
