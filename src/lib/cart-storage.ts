import type { Product } from "../data/schemas";
import { sanitizeCart, type CartItem } from "../domain/cart/cart";

export const CART_STORAGE_KEY = "season-cart:v1";

export function readCart(raw: string | null, products: readonly Product[]) {
  if (raw === null) return { items: [] as CartItem[], changed: false };
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null || !("version" in value) || value.version !== 1 || !("items" in value) || !Array.isArray(value.items)) {
      return { items: [] as CartItem[], changed: true };
    }
    const result = sanitizeCart(value.items, products);
    return { ...result, changed: result.changed || raw !== serializeCart(result.items) };
  } catch {
    return { items: [] as CartItem[], changed: true };
  }
}

export function serializeCart(items: readonly CartItem[]) {
  return JSON.stringify({ version: 1, items: items.map(({ productId, variantId, quantity, greetingCard }) => ({ productId, variantId, quantity, greetingCard })) });
}

export function loadBrowserCart(products: readonly Product[]) {
  try {
    return { ...readCart(window.localStorage.getItem(CART_STORAGE_KEY), products), storageAvailable: true };
  } catch {
    return { items: [] as CartItem[], changed: false, storageAvailable: false };
  }
}

export function saveBrowserCart(items: readonly CartItem[]) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(items));
    return true;
  } catch {
    return false;
  }
}
