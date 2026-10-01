import type { Collection } from "./schemas";
import imageAssets from "./image-assets.json";

const heroImage: Collection["heroImage"] = { ...imageAssets.hero, alt: "Иллюстративная сезонная композиция", role: "hero" };

export const collections: Collection[] = [
  { id: "morning-garden", slug: "morning-garden", name: "Утренний сад", intro: "Светлые, зелёные, воздушные композиции. Белые и сливочные оттенки с мягкой зеленью.", heroImage, productIds: ["first-light", "green-line", "white-bunch", "cream", "tulips-white", "matthiola", "green-bowl"] },
  { id: "warm-season", slug: "warm-season", name: "Тёплый сезон", intro: "Персиковые, розовые и винные акценты. Более плотные формы и тёплые сочетания.", heroImage: { ...imageAssets["warm-garden"], alt: "Тёплая сезонная композиция, иллюстрация концепта", role: "hero" }, productIds: ["quiet-pink", "warm-garden", "red-accent", "field", "tulips-wine", "rose-cloud", "season-box"] },
  { id: "single-flower", slug: "single-flower", name: "Один цветок", intro: "Монобукеты, где характер задаёт один основной вид цветка: тюльпаны или маттиола.", heroImage: { ...imageAssets["tulips-white"], alt: "Белые тюльпаны, иллюстрация концепта", role: "hero" }, productIds: ["tulips-white", "tulips-wine", "matthiola"] },
];
