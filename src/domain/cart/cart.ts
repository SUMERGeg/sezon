import { z } from "zod";
import type { Money, Product, ProductVariant } from "../../data/schemas";
import { getVariant } from "../catalog/selectors";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(Number.MIN_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER),
  greetingCard: z.boolean(),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type CartLine = CartItem & { key: string; product: Product; variant: ProductVariant; maxQuantity: number; total: Money };

export function cartItemKey(item: Pick<CartItem, "productId" | "variantId" | "greetingCard">) {
  return JSON.stringify([item.productId, item.variantId, item.greetingCard]);
}

export function maxCartQuantity(variant: ProductVariant) {
  return Math.min(9, variant.demoStock);
}

export function sanitizeCart(input: readonly unknown[], products: readonly Product[]) {
  const byId = new Map(products.map((product) => [product.id, product]));
  const lines = new Map<string, CartItem>();
  for (const raw of input) {
    const parsed = cartItemSchema.safeParse(raw);
    if (!parsed.success) continue;
    const item = parsed.data;
    const product = byId.get(item.productId);
    const variant = product && getVariant(product, item.variantId);
    if (!variant || maxCartQuantity(variant) === 0) continue;
    const key = cartItemKey(item);
    const quantity = Math.max(1, Math.min(maxCartQuantity(variant), item.quantity));
    const previous = lines.get(key);
    lines.set(key, { ...item, quantity: Math.min(maxCartQuantity(variant), quantity + (previous?.quantity ?? 0)) });
  }
  const items = [...lines.values()];
  return { items, changed: JSON.stringify(items) !== JSON.stringify(input) };
}

export function addCartItem(items: readonly CartItem[], item: CartItem, products: readonly Product[]) {
  return sanitizeCart([...items, item], products).items;
}

export function setCartQuantity(items: readonly CartItem[], key: string, quantity: number, products: readonly Product[]) {
  if (!Number.isSafeInteger(quantity)) return [...items];
  return sanitizeCart(items.map((item) => cartItemKey(item) === key ? { ...item, quantity } : item), products).items;
}

export function removeCartItem(items: readonly CartItem[], key: string) {
  return items.filter((item) => cartItemKey(item) !== key);
}

export function getCartSummary(items: readonly CartItem[], products: readonly Product[]) {
  const byId = new Map(products.map((product) => [product.id, product]));
  const lines: CartLine[] = sanitizeCart(items, products).items.flatMap((item) => {
    const product = byId.get(item.productId)!;
    const variant = getVariant(product, item.variantId)!;
    return [{ ...item, key: cartItemKey(item), product, variant, maxQuantity: maxCartQuantity(variant), total: { amount: variant.price.amount * item.quantity, currency: "RUB" } }];
  });
  return {
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: { amount: lines.reduce((sum, line) => sum + line.total.amount, 0), currency: "RUB" } satisfies Money,
  };
}
