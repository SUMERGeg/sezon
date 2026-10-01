import { describe, expect, it } from "vitest";
import { catalogSchema, type Catalog, type Product } from "../../src/data/schemas";
import { catalog } from "../../src/data/catalog";
import { filterProducts, parseCatalogQuery, sortProducts } from "../../src/domain/catalog/filters";
import { getProductBySlug, getCollectionBySlug, getVariant, getDefaultVariant, getStartingPrice } from "../../src/domain/catalog/selectors";
import { formatMoney } from "../../src/lib/money";

const image = { src: "/images/bouquet-placeholder.svg", alt: "Фото готовится", width: 600, height: 750, role: "catalog" as const };
const makeProduct = (id: string, overrides: Partial<Product> = {}): Product => ({
  id, slug: id, name: id, category: "AUTHOR_BOUQUET", collectionIds: ["collection"],
  occasionTags: ["BIRTHDAY"], paletteTags: ["LIGHT"], shortDescription: "Светлый букет", description: "Сезонная композиция", images: [image],
  variants: [{ id: `${id}-s`, size: "S", sizeLabel: "Небольшой", palette: "LIGHT", price: { amount: 100_000, currency: "RUB" }, demoStock: 3 }],
  ...overrides,
});
const fixture: Catalog = {
  products: [makeProduct("a"), makeProduct("b", { category: "MONO_BOUQUET", occasionTags: ["HOME"], variants: [{ id: "b-m", size: "M", sizeLabel: "Средний", palette: "LIGHT", price: { amount: 200_000, currency: "RUB" }, demoStock: 0 }] }), makeProduct("c", { occasionTags: ["DATE"], variants: [{ id: "c-m", size: "M", sizeLabel: "Средний", palette: "LIGHT", price: { amount: 100_000, currency: "RUB" }, demoStock: 4 }] })],
  collections: [{ id: "collection", slug: "collection", name: "Коллекция", intro: "Светлые букеты", heroImage: image, productIds: ["a", "b", "c"] }],
};

describe("catalog validation", () => {
  it("валидирует seed и позволяет найти каждый связанный товар", () => {
    const parsed = catalogSchema.parse(catalog);
    expect(parsed.products.length).toBeGreaterThanOrEqual(12);
    for (const collection of parsed.collections) {
      for (const id of collection.productIds) expect(parsed.products.some((product) => product.id === id && product.collectionIds.includes(collection.id))).toBe(true);
    }
  });

  it.each([
    ["дубликат ID", (data: Catalog) => { data.products[1].id = "a"; }],
    ["дубликат slug", (data: Catalog) => { data.products[1].slug = "a"; }],
    ["дубликат варианта", (data: Catalog) => { data.products[0].variants.push(data.products[0].variants[0]); }],
    ["пустые варианты", (data: Catalog) => { data.products[0].variants = []; }],
    ["дробная цена", (data: Catalog) => { data.products[0].variants[0].price.amount = 1.5; }],
    ["нулевая цена", (data: Catalog) => { data.products[0].variants[0].price.amount = 0; }],
    ["отрицательный stock", (data: Catalog) => { data.products[0].variants[0].demoStock = -1; }],
    ["дробный stock", (data: Catalog) => { data.products[0].variants[0].demoStock = 1.5; }],
    ["нет размеров изображения", (data: Catalog) => { data.products[0].images[0].width = 0; }],
    ["пустой alt", (data: Catalog) => { data.products[0].images[0].alt = ""; }],
    ["неизвестная коллекция", (data: Catalog) => { data.products[0].collectionIds = ["missing"]; }],
    ["неизвестный товар", (data: Catalog) => { data.collections[0].productIds.push("missing"); }],
    ["односторонняя связь", (data: Catalog) => { data.collections[0].productIds = ["b", "c"]; }],
    ["дубликат коллекции", (data: Catalog) => { data.collections.push(data.collections[0]); }],
  ])("отвергает: %s", (_name, mutate) => {
    const data = structuredClone(fixture);
    mutate(data);
    expect(catalogSchema.safeParse(data).success).toBe(false);
  });
});

describe("filter and sort", () => {
  it("использует OR внутри группы и AND между группами", () => {
    expect(filterProducts(fixture.products, { categories: ["AUTHOR_BOUQUET"], occasions: ["BIRTHDAY", "DATE"], palettes: ["LIGHT"] }).map((product) => product.id)).toEqual(["a", "c"]);
    expect(filterProducts(fixture.products, { categories: ["MONO_BOUQUET"], occasions: ["BIRTHDAY", "DATE"] })).toEqual([]);
  });

  it("учитывает включённые границы цены и наличие", () => {
    expect(filterProducts(fixture.products, { minPrice: 100_000, maxPrice: 100_000, availableOnly: true }).map((product) => product.id)).toEqual(["a", "c"]);
    expect(filterProducts(fixture.products, { minPrice: 200_000, availableOnly: true })).toEqual([]);
  });

  it("проверяет гамму, цену и stock у одного варианта", () => {
    const mixed = makeProduct("mixed", { paletteTags: ["LIGHT", "WARM"], variants: [
      { id: "mixed-s", size: "S", sizeLabel: "Небольшой", palette: "LIGHT", price: { amount: 100_000, currency: "RUB" }, demoStock: 0 },
      { id: "mixed-m", size: "M", sizeLabel: "Средний", palette: "WARM", price: { amount: 200_000, currency: "RUB" }, demoStock: 2 },
    ] });
    expect(filterProducts([mixed], { palettes: ["LIGHT"], availableOnly: true })).toEqual([]);
    expect(filterProducts([mixed], { maxPrice: 100_000, availableOnly: true })).toEqual([]);
    expect(filterProducts([mixed], { palettes: ["WARM"], minPrice: 200_000, availableOnly: true })).toEqual([mixed]);
  });

  it.each([
    ["recommended", ["a", "b", "c"]], ["price-asc", ["a", "c", "b"]],
    ["price-desc", ["b", "a", "c"]], ["newest", ["c", "b", "a"]],
  ] as const)("сортирует %s без мутации исходного порядка", (sort, expected) => {
    const before = structuredClone(fixture.products);
    expect(sortProducts(fixture.products, sort).map((product) => product.id)).toEqual(expected);
    expect(fixture.products).toEqual(before);
  });

  it("нормализует query, игнорируя неизвестные значения", () => {
    expect(parseCatalogQuery({ category: ["author", "unknown"], occasion: ["birthday", "date"], palette: "light", minPrice: "4900", maxPrice: "bad", available: "true", sort: "price-asc", tracking: "keep" })).toEqual({ categories: ["AUTHOR_BOUQUET"], occasions: ["BIRTHDAY", "DATE"], palettes: ["LIGHT"], minPrice: 490_000, availableOnly: true, sort: "price-asc" });
    expect(parseCatalogQuery({ category: "unknown", minPrice: "-1", maxPrice: "Infinity", sort: "unknown" })).toEqual({ sort: "recommended" });
    expect(parseCatalogQuery({ minPrice: "999999999999999999999" })).toEqual({ sort: "recommended" });
  });
});

describe("selectors and money", () => {
  it("разрешает только известные slugs и варианты", () => {
    expect(getProductBySlug(fixture.products, "a")?.id).toBe("a");
    expect(getProductBySlug(fixture.products, "missing")).toBeUndefined();
    expect(getCollectionBySlug(fixture.collections, "collection")?.productIds).toEqual(["a", "b", "c"]);
    expect(getCollectionBySlug(fixture.collections, "missing")).toBeUndefined();
    expect(getVariant(fixture.products[0], "a-s")?.price.amount).toBe(100_000);
    expect(getVariant(fixture.products[0], "missing")).toBeUndefined();
  });

  it("выбирает доступный вариант, сохраняя unavailable для явного выбора", () => {
    const product = structuredClone(fixture.products[0]);
    product.variants[0].demoStock = 0;
    product.variants.push({ ...product.variants[0], id: "a-m", size: "M", demoStock: 2, price: { amount: 240_000, currency: "RUB" } });
    expect(getDefaultVariant(product).id).toBe("a-m");
    expect(getVariant(product, "a-s")?.demoStock).toBe(0);
    expect(getStartingPrice(product)).toEqual({ amount: 100_000, currency: "RUB" });
    product.variants[1].demoStock = 0;
    expect(getDefaultVariant(product).id).toBe("a-s");
  });

  it("форматирует рубли и копейки без потери дробной части", () => {
    expect(formatMoney({ amount: 490_000, currency: "RUB" }).replace(/\s/g, " ")).toBe("4 900 ₽");
    expect(formatMoney({ amount: 490_050, currency: "RUB" }).replace(/\s/g, " ")).toBe("4 900,50 ₽");
    expect(formatMoney({ amount: 0, currency: "RUB" }).replace(/\s/g, " ")).toBe("0 ₽");
  });
});
