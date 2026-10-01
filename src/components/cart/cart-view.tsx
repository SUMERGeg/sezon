"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { catalog } from "@/data/catalog";
import { paletteLabels } from "@/domain/catalog/labels";
import { getCartSummary } from "@/domain/cart/cart";
import { formatMoney } from "@/lib/money";
import { cartActions, useCart } from "@/store/cart-store";

export function CartView() {
  const { items, ready, notice } = useCart();
  const { lines, count, subtotal } = getCartSummary(items, catalog.products);
  const [feedback, setFeedback] = useState("");
  const removeButtons = useRef(new Map<string, HTMLButtonElement>());
  const emptyHeading = useRef<HTMLHeadingElement>(null);

  function remove(key: string) {
    const index = lines.findIndex((line) => line.key === key);
    const target = lines[index + 1] ?? lines[index - 1];
    const name = lines[index].product.name;
    cartActions.remove(key);
    setFeedback(`Букет «${name}» удалён из корзины.`);
    requestAnimationFrame(() => {
      if (target) removeButtons.current.get(target.key)?.focus();
      else emptyHeading.current?.focus();
    });
  }

  return <>
    <p className="cart-notice" role="status" aria-label="Состояние корзины">{notice}</p>
    <p className="cart-feedback" role="status" aria-label="Изменение корзины">{feedback}</p>
    {!ready ? <p className="cart-loading" role="status">Восстанавливаем ваш выбор…</p> : lines.length === 0 ?
      <div className="cart-empty"><h2 ref={emptyHeading} tabIndex={-1}>Пока здесь нет букетов</h2><p>Выберите букет и размер — ваш выбор останется в этом браузере.</p><Link className="button" href="/shop">Перейти к букетам</Link></div> :
      <div className="cart-layout">
        <ul className="cart-items" aria-label="Букеты в корзине">
          {lines.map((line) => {
            const image = line.product.images[0];
            const label = `${line.product.name}, ${line.variant.size === "ONE_SIZE" ? line.variant.sizeLabel : line.variant.size}${line.greetingCard ? ", с открыткой" : ", без открытки"}`;
            return <li className="cart-item" key={line.key}>
              <Link className="cart-thumbnail" href={`/shop/${line.product.slug}`} tabIndex={-1} aria-hidden="true"><Image src={image.src} alt="" width={image.width} height={image.height} sizes="(max-width: 767px) 88px, 120px" /></Link>
              <div className="cart-item-info"><h2><Link href={`/shop/${line.product.slug}`}>{line.product.name}</Link></h2>
                <p className="cart-item-options">Размер: {line.variant.size === "ONE_SIZE" ? line.variant.sizeLabel : line.variant.size}{line.variant.palette && <> · {paletteLabels[line.variant.palette]}</>}</p>
                <p className="cart-item-options">{line.greetingCard ? "С открыткой · без доплаты в демо" : "Без открытки"}</p>
                <p className="cart-unit-price">{formatMoney(line.variant.price)} / букет</p>
                <div className="cart-item-controls">
                  <div className="quantity-control" role="group" aria-label={`Количество: ${label}`}>
                    <button type="button" disabled={line.quantity <= 1} aria-label={`Уменьшить количество: ${label}`} onClick={() => { cartActions.setQuantity(line.key, line.quantity - 1); setFeedback(`${label}: ${line.quantity - 1} шт.`); }}>−</button>
                    <span role="status" aria-label="Количество">{line.quantity}</span>
                    <button type="button" disabled={line.quantity >= line.maxQuantity} aria-label={`Увеличить количество: ${label}`} onClick={() => { cartActions.setQuantity(line.key, line.quantity + 1); setFeedback(`${label}: ${line.quantity + 1} шт.`); }}>+</button>
                  </div>
                  <button type="button" className="remove-item" aria-label={`Удалить: ${label}`} ref={(element) => { if (element) removeButtons.current.set(line.key, element); else removeButtons.current.delete(line.key); }} onClick={() => remove(line.key)}>Удалить</button>
                </div>
                {line.quantity >= line.maxQuantity && <p className="cart-limit">Достигнут лимит количества в демо-каталоге.</p>}
              </div>
              <p className="cart-line-total">{formatMoney(line.total)}</p>
            </li>;
          })}
        </ul>
        <section className="cart-summary" aria-label="Итог корзины"><h2>Ваш выбор</h2><p className="cart-summary-count">Букетов: {count}</p><div className="cart-subtotal"><span>Товары</span><strong aria-live="polite">{formatMoney(subtotal)}</strong></div><p>Доставка рассчитывается в демонстрационном оформлении.</p><Link className="button" href="/checkout">Демонстрационное оформление</Link><p className="demo-caption">Заказ и оплата не выполняются. Контакты не сохраняются.</p><Link className="text-link" href="/shop">Продолжить выбор</Link></section>
      </div>}
  </>;
}
