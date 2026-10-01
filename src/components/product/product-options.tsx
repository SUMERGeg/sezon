"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/schemas";
import { getDefaultVariant, getVariant } from "@/domain/catalog/selectors";
import { paletteLabels } from "@/domain/catalog/labels";
import { formatMoney } from "@/lib/money";
import { cartActions, useCart } from "@/store/cart-store";

export function ProductOptions({ product }: { product: Product }) {
  const [selectedId, setSelectedId] = useState(getDefaultVariant(product).id);
  const [greetingCard, setGreetingCard] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { ready, storageAvailable } = useCart();
  const id = useId();
  const selected = getVariant(product, selectedId)!;
  return (
    <div className="product-options">
      <p className="selected-price" aria-live="polite">{formatMoney(selected.price)}</p>
      <fieldset className="variant-fieldset"><legend>Размер букета</legend><div className="size-options">
        {product.variants.map((variant) => <label className={`size-option${variant.demoStock === 0 ? " size-unavailable" : ""}`} key={variant.id}>
          <input type="radio" name={`${id}-variant`} checked={selectedId === variant.id} value={variant.id} onChange={() => setSelectedId(variant.id)} />
          <span className="size-label">{variant.size === "ONE_SIZE" ? "Один размер" : variant.size} <small>≈ {variant.approximateDiameterCm} см</small></span>
          {variant.demoStock === 0 && <span className="size-note">Недоступен</span>}
        </label>)}
      </div></fieldset>
      {selected.palette && <p className="palette-summary">Гамма: {paletteLabels[selected.palette]}</p>}
      <p className={`availability${selected.demoStock === 0 ? " unavailable" : ""}`} role="status" aria-label="Доступность варианта">{selected.demoStock > 0 ? "Доступен в демо-каталоге" : "Недоступен в демо-каталоге. Выберите другой размер."}</p>
      <label className="check-label greeting-option"><input type="checkbox" checked={greetingCard} onChange={(event) => setGreetingCard(event.target.checked)} />Добавить открытку</label>
      <button type="button" className="button purchase-button" disabled={!ready || selected.demoStock <= 0} aria-describedby={`${id}-cart-note`} onClick={() => {
        const result = cartActions.add({ productId: product.id, variantId: selected.id, quantity: 1, greetingCard });
        setFeedback(result.added ? `Букет «${product.name}» добавлен. Вариант ${selected.sizeLabel}${greetingCard ? ", с открыткой" : ""}: ${result.quantity} шт. в корзине.` : "Достигнут лимит количества этого варианта в демо-каталоге.");
      }}>В корзину</button>
      <p className="add-feedback" role="status" aria-label="Добавление в корзину">{feedback}</p>
      {feedback && <Link className="text-link" href="/cart">Перейти в корзину</Link>}
      <p id={`${id}-cart-note`} className="demo-caption">Демонстрационная корзина. Заказы и оплата не выполняются.{!storageAvailable && " Сохранение недоступно: выбор останется только до перезагрузки вкладки."}</p>
    </div>
  );
}
