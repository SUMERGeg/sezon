import { describe, expect, it } from "vitest";
import { catalog } from "../../src/data/catalog";
import { addCartItem, cartItemKey, getCartSummary, removeCartItem, sanitizeCart, setCartQuantity } from "../../src/domain/cart/cart";
import { readCart, serializeCart } from "../../src/lib/cart-storage";

const products = catalog.products;
const small = { productId: "first-light", variantId: "first-light-s", quantity: 1, greetingCard: false };

describe("cart business rules", () => {
  it("merges identical choices and separates size/card", () => {
    const first = addCartItem([], small, products);
    const merged = addCartItem(first, small, products);
    expect(merged).toEqual([{ ...small, quantity: 2 }]);
    const withCard = addCartItem(merged, { ...small, greetingCard: true }, products);
    const large = addCartItem(withCard, { ...small, variantId: "first-light-l" }, products);
    expect(large.map((item) => item.quantity)).toEqual([2, 1, 1]);
  });

  it("enforces stock and the demo limit on merged additions", () => {
    expect(addCartItem([{ ...small, quantity: 5 }], small, products)[0].quantity).toBe(5);
    const ample = products.map((product) => ({ ...product, variants: product.variants.map((variant) => ({ ...variant, demoStock: 20 })) }));
    expect(addCartItem([{ ...small, quantity: 8 }], { ...small, quantity: 4 }, ample)[0].quantity).toBe(9);
    expect(addCartItem([], { ...small, variantId: "first-light-m" }, products)).toEqual([]);
  });

  it("decrement cannot remove a line; explicit remove affects only that choice", () => {
    const items = [small, { ...small, greetingCard: true }];
    expect(setCartQuantity(items, cartItemKey(small), 0, products)).toEqual(items);
    expect(setCartQuantity(items, cartItemKey(small), 100, products)[0].quantity).toBe(5);
    expect(removeCartItem(items, cartItemKey(small))).toEqual([{ ...small, greetingCard: true }]);
  });

  it("drops stale references and invalid rows, normalizes quantity and duplicates", () => {
    const result = sanitizeCart([
      { ...small, quantity: 99, price: 1, phone: "private" },
      small,
      { ...small, greetingCard: true, quantity: -2 },
      { ...small, productId: "missing" },
      { ...small, variantId: "missing" },
      { ...small, variantId: "first-light-m" },
      { ...small, quantity: 1.2 },
      null,
    ], products);
    expect(result.items).toEqual([{ ...small, quantity: 5 }, { ...small, greetingCard: true }]);
    expect(result.changed).toBe(true);
    expect(sanitizeCart([small], products).changed).toBe(false);
  });

  it("reconciles reduced stock and unavailable variants after catalog changes", () => {
    const changed = products.map((product) => ({ ...product, variants: product.variants.map((variant) => ({ ...variant, demoStock: variant.id === small.variantId ? 2 : 0 })) }));
    expect(sanitizeCart([{ ...small, quantity: 4 }, { ...small, variantId: "first-light-l" }], changed).items).toEqual([{ ...small, quantity: 2 }]);
  });

  it("calculates count/subtotal from current catalog prices, never stored prices", () => {
    const summary = getCartSummary([{ ...small, quantity: 2 }, { ...small, variantId: "first-light-l" }], products);
    expect(summary.count).toBe(3);
    expect(summary.subtotal).toEqual({ amount: 1790000, currency: "RUB" });
    expect(summary.lines[0].total.amount).toBe(980000);
    const changed = products.map((product) => ({ ...product, variants: product.variants.map((variant) => ({ ...variant, price: { ...variant.price, amount: 10000 } })) }));
    expect(getCartSummary([small], changed).subtotal.amount).toBe(10000);
  });
});

describe("cart persistence", () => {
  it("recovers from malformed JSON, envelope versions and shapes", () => {
    for (const raw of ["{", "null", "[]", '{"version":2,"items":[]}', '{"version":1,"items":{}}']) {
      expect(readCart(raw, products)).toEqual({ items: [], changed: true });
    }
    expect(readCart(null, products)).toEqual({ items: [], changed: false });
  });

  it("keeps valid rows while removing unavailable/invalid rows and sensitive fields", () => {
    const result = readCart(JSON.stringify({ version: 1, items: [small, { ...small, variantId: "first-light-m" }, { ...small, greetingCard: true, email: "private", price: 1 }] }), products);
    expect(result.items).toEqual([small, { ...small, greetingCard: true }]);
    expect(result.changed).toBe(true);
    const serialized = serializeCart(result.items);
    expect(JSON.parse(serialized)).toEqual({ version: 1, items: [small, { ...small, greetingCard: true }] });
    expect(serialized).not.toMatch(/email|price|private/);
  });
});
