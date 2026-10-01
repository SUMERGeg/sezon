import type { Occasion, Palette, Product, ProductCategory, ProductVariant } from "./schemas";
import imageAssets from "./image-assets.json";

type ProductSeed = {
  slug: string;
  name: string;
  category: ProductCategory;
  collectionIds: string[];
  basePrice: number;
  sizes: ProductVariant["size"][];
  palette: Palette;
  occasions: Occasion[];
  description: string;
  featured?: boolean;
  unavailableSize?: ProductVariant["size"];
};

const sizeLabels = { S: "Небольшой", M: "Средний", L: "Большой", ONE_SIZE: "Один размер" };
const diameters = { S: 30, M: 42, L: 52, ONE_SIZE: 35 };

function createProduct(seed: ProductSeed): Product {
  const hasSmall = seed.sizes.includes("S");
  const image = imageAssets[seed.slug as keyof typeof imageAssets];
  return {
    id: seed.slug,
    slug: seed.slug,
    name: seed.name,
    category: seed.category,
    collectionIds: seed.collectionIds,
    occasionTags: [...seed.occasions, "JUST_BECAUSE"],
    paletteTags: [seed.palette],
    shortDescription: seed.description,
    description: seed.description,
    seasonalNote: "Отдельные сорта могут меняться по сезону. Сохраняется общий характер, гамма и объём композиции.",
    images: [
      { ...image, alt: `Иллюстративный букет «${seed.name}»`, role: "catalog" },
      { ...image, alt: `Деталь иллюстративной композиции «${seed.name}»`, role: "detail" },
      { ...imageAssets.hero, alt: "Светлая сезонная композиция — настроение коллекции", role: "context" },
    ],
    variants: seed.sizes.map((size) => ({
      id: `${seed.slug}-${size.toLowerCase().replaceAll("_", "-")}`,
      size,
      sizeLabel: sizeLabels[size],
      approximateDiameterCm: diameters[size],
      palette: seed.palette,
      price: { amount: (seed.basePrice + (hasSmall ? size === "M" ? 1400 : size === "L" ? 3200 : 0 : size === "L" ? 1800 : 0)) * 100, currency: "RUB" },
      demoStock: seed.unavailableSize === size ? 0 : 5,
    })),
    featured: seed.featured ?? false,
  };
}

export const products: Product[] = [
  createProduct({ slug: "first-light", name: "Первый свет", category: "AUTHOR_BOUQUET", collectionIds: ["morning-garden"], basePrice: 4900, sizes: ["S", "M", "L"], palette: "LIGHT", occasions: ["BIRTHDAY", "THANK_YOU"], description: "Воздушный светлый букет с белыми сезонными цветами и мягкой зеленью. Спокойная композиция без яркого цветового центра.", featured: true, unavailableSize: "M" }),
  createProduct({ slug: "quiet-pink", name: "Тихий розовый", category: "AUTHOR_BOUQUET", collectionIds: ["warm-season"], basePrice: 5400, sizes: ["M", "L"], palette: "PINK_WINE", occasions: ["BIRTHDAY", "DATE"], description: "Мягкая розовая гамма с винными акцентами. Округлая форма для спокойного подарка.", featured: true }),
  createProduct({ slug: "green-line", name: "Зелёная линия", category: "AUTHOR_BOUQUET", collectionIds: ["morning-garden"], basePrice: 4600, sizes: ["S", "M"], palette: "GREEN_WHITE", occasions: ["THANK_YOU", "HOME"], description: "Белые сезонные цветы и выразительная зелень. Свободная форма для дома или небольшого подарка." }),
  createProduct({ slug: "warm-garden", name: "Тёплый сад", category: "AUTHOR_BOUQUET", collectionIds: ["warm-season"], basePrice: 5900, sizes: ["M", "L"], palette: "WARM", occasions: ["BIRTHDAY"], description: "Персиковые и тёплые розовые оттенки в объёмном сезонном букете.", featured: true }),
  createProduct({ slug: "white-bunch", name: "Белая охапка", category: "SEASONAL_BUNCH", collectionIds: ["morning-garden"], basePrice: 3900, sizes: ["ONE_SIZE"], palette: "LIGHT", occasions: ["THANK_YOU"], description: "Свободная охапка белых сезонных цветов. Лёгкая композиция с естественной линией стеблей." }),
  createProduct({ slug: "red-accent", name: "Красный акцент", category: "AUTHOR_BOUQUET", collectionIds: ["warm-season"], basePrice: 6200, sizes: ["M", "L"], palette: "BRIGHT", occasions: ["BIRTHDAY", "DATE"], description: "Плотный букет с глубокими красными и винными акцентами. Выразительный подарок с сезонным составом." }),
  createProduct({ slug: "cream", name: "Сливочный", category: "AUTHOR_BOUQUET", collectionIds: ["morning-garden"], basePrice: 5100, sizes: ["S", "M", "L"], palette: "LIGHT", occasions: [], description: "Сливочные оттенки и мягкая зелень. Компактная округлая форма без резких цветовых контрастов.", featured: true }),
  createProduct({ slug: "field", name: "Полевой", category: "SEASONAL_BUNCH", collectionIds: ["warm-season"], basePrice: 4200, sizes: ["S", "M"], palette: "WARM", occasions: ["HOME"], description: "Небольшая сезонная охапка в тёплой гамме. Разная высота стеблей создаёт свободный силуэт." }),
  createProduct({ slug: "tulips-white", name: "Белые тюльпаны", category: "MONO_BOUQUET", collectionIds: ["morning-garden", "single-flower"], basePrice: 3600, sizes: ["M", "L"], palette: "LIGHT", occasions: [], description: "Белые тюльпаны без дополнительных цветовых акцентов. Простая форма и живое движение стеблей." }),
  createProduct({ slug: "tulips-wine", name: "Винные тюльпаны", category: "MONO_BOUQUET", collectionIds: ["warm-season", "single-flower"], basePrice: 3900, sizes: ["M", "L"], palette: "PINK_WINE", occasions: ["DATE"], description: "Тюльпаны глубокого винного оттенка. Один вид цветка задаёт цвет и характер букета." }),
  createProduct({ slug: "matthiola", name: "Маттиола", category: "MONO_BOUQUET", collectionIds: ["morning-garden", "single-flower"], basePrice: 4300, sizes: ["M", "L"], palette: "LIGHT", occasions: ["HOME"], description: "Светлая маттиола с вытянутыми соцветиями. Воздушный монобукет для стола или небольшого пространства." }),
  createProduct({ slug: "green-bowl", name: "Зелёная чаша", category: "ARRANGEMENT", collectionIds: ["morning-garden"], basePrice: 6400, sizes: ["ONE_SIZE"], palette: "GREEN_WHITE", occasions: ["HOME"], description: "Зелёно-белая композиция в чаше. Невысокая форма для стола и спокойных домашних пространств." }),
  createProduct({ slug: "rose-cloud", name: "Розовое облако", category: "ARRANGEMENT", collectionIds: ["warm-season"], basePrice: 6900, sizes: ["ONE_SIZE"], palette: "PINK_WINE", occasions: ["BIRTHDAY"], description: "Мягкая розовая композиция с винными деталями. Плотная округлая форма в сосуде." }),
  createProduct({ slug: "season-box", name: "Коробка сезона", category: "ARRANGEMENT", collectionIds: ["warm-season"], basePrice: 7200, sizes: ["ONE_SIZE"], palette: "WARM", occasions: [], description: "Сезонные цветы в коробке, собранные в тёплой гамме. Композиция с низким цветовым центром." }),
];
