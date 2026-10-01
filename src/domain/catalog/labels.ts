import type { Palette, ProductCategory } from "../../data/schemas";

export const categoryLabels: Record<ProductCategory, string> = {
  AUTHOR_BOUQUET: "Авторский букет", MONO_BOUQUET: "Монобукет", ARRANGEMENT: "Композиция", SEASONAL_BUNCH: "Сезонная охапка",
};
export const paletteLabels: Record<Palette, string> = {
  LIGHT: "Светлая", PINK_WINE: "Розово-винная", GREEN_WHITE: "Зелёно-белая", WARM: "Тёплая", BRIGHT: "Яркая",
};
