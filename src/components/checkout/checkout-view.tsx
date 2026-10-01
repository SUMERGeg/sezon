"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { catalog } from "@/data/catalog";
import { deliveryMethods, deliverySlots, type DeliveryMethodId } from "@/data/delivery";
import { getCartSummary, type CartLine } from "@/domain/cart/cart";
import { getCheckoutTotal, getDemoDates, validateCheckout, type CheckoutErrors, type CheckoutField } from "@/domain/checkout/checkout";
import type { Money } from "@/data/schemas";
import { formatMoney } from "@/lib/money";
import { cartActions, useCart } from "@/store/cart-store";
import { CustomSelect } from "@/components/ui/custom-select";

type DemoResult = { count: number; method: string; date: string; slot: string; total: Money };
const fieldOrder: CheckoutField[] = ["deliveryMethodId", "date", "slotId", "recipientName", "phone", "email", "address", "greetingMessage", "comment"];

export function CheckoutView() {
  const { items, ready, notice } = useCart();
  const { lines, subtotal } = getCartSummary(items, catalog.products);
  const [result, setResult] = useState<DemoResult | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (result) heading.current?.focus(); }, [result]);

  if (result) return <section className="checkout-success" aria-label="Результат демонстрации">
    <p className="eyebrow">Сценарий пройден</p><h2 tabIndex={-1} ref={heading}>Демонстрация завершена</h2><p>Заказ не создан, данные никуда не отправлены. Контакты и текст открытки очищены, корзина пуста.</p>
    <dl className="demo-result"><div><dt>Букетов</dt><dd>{result.count}</dd></div><div><dt>Получение — пример</dt><dd>{result.method}</dd></div><div><dt>Дата и интервал — пример</dt><dd>{result.date}, {result.slot}</dd></div><div><dt>Итого в демонстрации</dt><dd>{formatMoney(result.total)}</dd></div></dl>
    <Link className="button" href="/shop">Вернуться к букетам</Link>
  </section>;
  if (!ready) return <p className="cart-loading" role="status">Восстанавливаем ваш выбор…</p>;
  if (lines.length === 0) return <div className="cart-empty"><h2>Сначала выберите букет</h2><p>Для демонстрации оформления добавьте букет в корзину.</p><Link className="button" href="/shop">Перейти к букетам</Link></div>;
  return <><p className="cart-notice" role="status" aria-label="Состояние корзины">{notice}</p><CheckoutForm lines={lines} subtotal={subtotal} onComplete={(summary) => { setResult(summary); cartActions.clear(); }} /></>;
}

function CheckoutForm({ lines, subtotal, onComplete }: { lines: CartLine[]; subtotal: Money; onComplete: (result: DemoResult) => void }) {
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  const [methodId, setMethodId] = useState<DeliveryMethodId>("courier");
  const [dates, setDates] = useState(() => getDemoDates());
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const hasGreetingCard = lines.some((line) => line.greetingCard);
  const method = deliveryMethods.find((method) => method.id === methodId)!;
  const total = getCheckoutTotal(subtotal, methodId)!;

  const fieldId = (field: CheckoutField) => `${id}-${field}`;
  function attributes(field: CheckoutField) {
    return { id: fieldId(field), name: field, "aria-invalid": errors[field] ? true as const : undefined, "aria-describedby": [errors[field] ? `${fieldId(field)}-error` : "", field === "phone" ? `${id}-phone-hint` : "", field === "greetingMessage" ? `${id}-card-hint` : ""].filter(Boolean).join(" ") || undefined };
  }
  function error(field: CheckoutField) {
    return errors[field] ? <span className="field-error" id={`${fieldId(field)}-error`}>{errors[field]}</span> : null;
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const draft = Object.fromEntries(new FormData(event.currentTarget));
    const validated = validateCheckout({ ...draft, deliveryMethodId: methodId, email: draft.email ?? "", greetingMessage: draft.greetingMessage ?? "", comment: draft.comment ?? "", address: draft.address ?? "" }, { hasGreetingCard });
    if (!validated.success) {
      setErrors(validated.errors);
      if (validated.errors.date) { setDates(getDemoDates()); setDate(""); }
      const first = fieldOrder.find((field) => validated.errors[field]);
      requestAnimationFrame(() => {
        const control = first && (document.getElementById(fieldId(first)) ?? form.current?.elements.namedItem(first));
        if (control instanceof HTMLElement) control.focus();
        else if (control instanceof RadioNodeList) (control[0] as HTMLElement | undefined)?.focus();
      });
      return;
    }
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const summary: DemoResult = { count, method: method.label, date: dates.find((date) => date.value === validated.data.date)!.label, slot: deliverySlots.find((slot) => slot.id === validated.data.slotId)!.label, total };
    event.currentTarget.reset();
    onComplete(summary);
  }

  return <div className="checkout-layout">
    <form ref={form} className="checkout-form" aria-label="Демонстрационное оформление" noValidate autoComplete="off" onSubmit={submit} onChange={(event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
      const name = target.name as CheckoutField;
      if (errors[name]) setErrors((current) => { const next = { ...current }; delete next[name]; return next; });
    }}>
      {Object.keys(errors).length > 0 && <div className="checkout-errors" role="alert">Проверьте отмеченные поля. Корзина сохранена.</div>}
      <fieldset className="checkout-group"><legend>01 / Получение</legend><div className="delivery-options">{deliveryMethods.map((option) => <label key={option.id} className="delivery-option"><input type="radio" name="deliveryMethodId" value={option.id} checked={methodId === option.id} onChange={() => setMethodId(option.id)} aria-describedby={errors.deliveryMethodId ? `${fieldId("deliveryMethodId")}-error` : undefined} /><span>{option.label}<small>{option.price.amount === 0 ? "Без доплаты в демо" : `${formatMoney(option.price)} · пример тарифа`}</small></span></label>)}</div>{error("deliveryMethodId")}
        <p className="field-hint">{methodId === "pickup" ? "Самовывоз показан как сценарий. Реальная точка выдачи и её адрес не назначены." : "Доставка и её стоимость показаны как пример. Реальная доставка не выполняется."}</p>
        <div className="checkout-fields two-fields">
          <div className="checkout-field"><label htmlFor={fieldId("date")}>Дата</label><CustomSelect {...attributes("date")} label="Дата" required value={date} placeholder="Выберите дату" options={dates.map((item) => ({ value: item.value, label: item.label }))} onChange={(value) => { setDate(value); setErrors((current) => { const next = { ...current }; delete next.date; return next; }); }} />{error("date")}</div>
          <div className="checkout-field"><label htmlFor={fieldId("slotId")}>Интервал</label><CustomSelect {...attributes("slotId")} label="Интервал" required value={slot} placeholder="Выберите интервал" options={deliverySlots.map((item) => ({ value: item.id, label: `${item.label}${!item.enabled ? " — недоступен в примере" : ""}`, disabled: !item.enabled }))} onChange={(value) => { setSlot(value); setErrors((current) => { const next = { ...current }; delete next.slotId; return next; }); }} />{error("slotId")}</div>
        </div><p className="field-hint">Даты и интервалы — пример расписания, а не обещание наличия или доставки.</p>
      </fieldset>
      <fieldset className="checkout-group"><legend>02 / Тестовые контакты</legend><p className="field-hint">Используйте вымышленные данные. Поля нужны только для демонстрации проверки формата.</p>
        <div className="checkout-fields">
          <div className="checkout-field"><label htmlFor={fieldId("recipientName")}>Имя получателя</label><input {...attributes("recipientName")} type="text" required maxLength={80} placeholder="Тестовый получатель" />{error("recipientName")}</div>
          <div className="checkout-field"><label htmlFor={fieldId("phone")}>Телефон</label><input {...attributes("phone")} type="tel" inputMode="tel" required maxLength={30} placeholder="+7 (999) 123-45-67" /><span id={`${id}-phone-hint`} className="field-hint">11 цифр, начиная с +7 или 8. Номер никуда не отправляется.</span>{error("phone")}</div>
          <div className="checkout-field"><label htmlFor={fieldId("email")}>Email <span className="optional-label">необязательно</span></label><input {...attributes("email")} type="email" maxLength={254} placeholder="demo@example.com" />{error("email")}</div>
          {method.requiresAddress && <div className="checkout-field"><label htmlFor={fieldId("address")}>Адрес</label><input {...attributes("address")} type="text" required maxLength={200} placeholder="Пример адреса, дом 1" />{error("address")}</div>}
        </div>
      </fieldset>
      <fieldset className="checkout-group"><legend>03 / Маленькие дополнения</legend><div className="checkout-fields">
        {hasGreetingCard && <div className="checkout-field"><label htmlFor={fieldId("greetingMessage")}>Текст открытки <span className="optional-label">необязательно</span></label><textarea {...attributes("greetingMessage")} rows={3} maxLength={180} placeholder="Несколько тёплых слов" /><span id={`${id}-card-hint`} className="field-hint">До 180 символов. Один текст для выбранных открыток; он не сохраняется.</span>{error("greetingMessage")}</div>}
        <div className="checkout-field"><label htmlFor={fieldId("comment")}>Комментарий <span className="optional-label">необязательно</span></label><textarea {...attributes("comment")} rows={3} maxLength={500} placeholder="Пример пожелания к букету" />{error("comment")}</div>
      </div></fieldset>
      <p className="checkout-privacy">Контакты, адрес и тексты не сохраняются и не отправляются. Завершение демонстрации очистит корзину.</p>
      <button className="button checkout-submit" type="submit">Завершить демонстрацию</button><Link className="text-link" href="/cart">Вернуться в корзину</Link>
    </form>
    <section className="checkout-summary" aria-label="Итог оформления"><h2>Ваш букет</h2><ul className="checkout-products" aria-label="Состав демонстрации">{lines.map((line) => <li key={line.key}><Image src={line.product.images[0].src} alt="" width={line.product.images[0].width} height={line.product.images[0].height} sizes="64px" /><div><p>{line.product.name}</p><small>{line.variant.size === "ONE_SIZE" ? line.variant.sizeLabel : line.variant.size} · {line.quantity} шт.{line.greetingCard && " · открытка"}</small><span>{formatMoney(line.total)}</span></div></li>)}</ul><dl className="checkout-totals"><div><dt>Товары</dt><dd>{formatMoney(subtotal)}</dd></div><div><dt>{method.label} · демо</dt><dd>{formatMoney(method.price)}</dd></div><div className="checkout-total"><dt>Итого</dt><dd aria-live="polite">{formatMoney(total)}</dd></div></dl><p className="demo-caption">Состав может меняться по сезону; сохраняются гамма, объём и общий характер букета.</p></section>
  </div>;
}
