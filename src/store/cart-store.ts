"use client";

import { useSyncExternalStore } from "react";
import { catalog } from "@/data/catalog";
import { addCartItem, cartItemKey, removeCartItem, setCartQuantity, type CartItem } from "@/domain/cart/cart";
import { CART_STORAGE_KEY, loadBrowserCart, readCart, saveBrowserCart } from "@/lib/cart-storage";

type CartState = { items: CartItem[]; ready: boolean; storageAvailable: boolean; notice: string };
const serverState: CartState = { items: [], ready: false, storageAvailable: true, notice: "" };
const updatedNotice = "Корзина обновлена по текущему демо-каталогу: недоступные позиции удалены, количество и сохранённые данные скорректированы.";
const memoryNotice = "Сохранение в браузере недоступно. Корзина работает только в текущей вкладке до перезагрузки.";
let state = serverState;
const listeners = new Set<() => void>();

function emit(next: CartState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function initialize() {
  if (state.ready) return;
  const loaded = loadBrowserCart(catalog.products);
  const storageAvailable = loaded.storageAvailable && (!loaded.changed || saveBrowserCart(loaded.items));
  emit({ items: loaded.items, ready: true, storageAvailable, notice: !storageAvailable ? memoryNotice : loaded.changed ? updatedNotice : "" });
}

function onStorage(event: StorageEvent) {
  if (event.key !== CART_STORAGE_KEY && event.key !== null) return;
  const loaded = readCart(event.newValue, catalog.products);
  // Normal events already contain safe rows; rewrite only when reconciliation is needed.
  const storageAvailable = !loaded.changed || saveBrowserCart(loaded.items);
  emit({ items: loaded.items, ready: true, storageAvailable, notice: !storageAvailable ? memoryNotice : loaded.changed ? updatedNotice : "Корзина обновлена в другой вкладке." });
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  initialize();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function commit(items: CartItem[]) {
  const storageAvailable = saveBrowserCart(items);
  emit({ ...state, items, storageAvailable, notice: storageAvailable ? state.notice === memoryNotice ? "" : state.notice : memoryNotice });
}

export const cartActions = {
  clear() {
    commit([]);
  },
  add(item: CartItem) {
    initialize();
    const key = cartItemKey(item);
    const previous = state.items.find((line) => cartItemKey(line) === key)?.quantity ?? 0;
    const next = addCartItem(state.items, item, catalog.products);
    const quantity = next.find((line) => cartItemKey(line) === key)?.quantity ?? 0;
    commit(next);
    return { added: quantity > previous, quantity };
  },
  setQuantity(key: string, quantity: number) {
    commit(setCartQuantity(state.items, key, quantity, catalog.products));
  },
  remove(key: string) {
    commit(removeCartItem(state.items, key));
  },
};

export function useCart() {
  return useSyncExternalStore(subscribe, () => state, () => serverState);
}
