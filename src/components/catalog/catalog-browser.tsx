"use client";

import { useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/data/schemas";
import { filterProducts, parseCatalogQuery, sortProducts, type CatalogQuery } from "@/domain/catalog/filters";
import { clearCatalogQuery, updateCatalogQuery, type CatalogQueryKey } from "@/domain/catalog/query";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { CustomSelect } from "@/components/ui/custom-select";
import { ProductList } from "./product-list";
import { filterGroups } from "./filter-options";

type Chip = { key: CatalogQueryKey; value: string; label: string };

function queryRecord(params: URLSearchParams): CatalogQuery {
  return Object.fromEntries([...new Set(params.keys())].map((key) => [key, params.getAll(key).length === 1 ? params.get(key)! : params.getAll(key)]));
}

function FilterControls({ params, update }: { params: URLSearchParams; update: (key: CatalogQueryKey, values: string[]) => void }) {
  const id = useId();
  const parsed = parseCatalogQuery(queryRecord(params));
  return (
    <div className="filter-fields">
      {filterGroups.map((group) => <fieldset key={group.key}><legend>{group.title}</legend>{group.options.map(([value, label]) => <label className="check-label" key={value}>
        <input type="checkbox" checked={params.getAll(group.key).includes(value)} onChange={(event) => update(group.key, event.target.checked ? [...params.getAll(group.key), value] : params.getAll(group.key).filter((item) => item !== value))} />{label}
      </label>)}</fieldset>)}
      <fieldset><legend>Цена, ₽</legend><div className="price-inputs">
        <label htmlFor={`${id}-min`}>От<input id={`${id}-min`} type="number" inputMode="numeric" min="0" step="1" value={parsed.minPrice !== undefined ? parsed.minPrice / 100 : ""} placeholder="0" onChange={(event) => update("minPrice", event.target.value ? [event.target.value] : [])} /></label>
        <label htmlFor={`${id}-max`}>До<input id={`${id}-max`} type="number" inputMode="numeric" min="0" step="1" value={parsed.maxPrice !== undefined ? parsed.maxPrice / 100 : ""} placeholder="Любая" onChange={(event) => update("maxPrice", event.target.value ? [event.target.value] : [])} /></label>
      </div></fieldset>
      <label className="check-label"><input type="checkbox" checked={parsed.availableOnly ?? false} onChange={(event) => update("available", event.target.checked ? ["true"] : [])} />Доступные в демо</label>
    </div>
  );
}

export function CatalogBrowser({ products }: { products: Product[] }) {
  const search = useSearchParams();
  return <CatalogContent products={products} query={search.toString()} />;
}

export function CatalogFallback({ products }: { products: Product[] }) {
  return <CatalogContent products={products} query="" />;
}

function CatalogContent({ products, query }: { products: Product[]; query: string }) {
  const sortId = useId();
  const params = new URLSearchParams(query);
  const filters = parseCatalogQuery(queryRecord(params));
  const visible = sortProducts(filterProducts(products, filters), filters.sort);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const chips: Chip[] = filterGroups.flatMap((group) => group.options.filter(([value]) => params.getAll(group.key).includes(value)).map(([value, label]) => ({ key: group.key, value, label })));
  if (filters.minPrice !== undefined) chips.push({ key: "minPrice", value: params.get("minPrice")!, label: `От ${filters.minPrice / 100} ₽` });
  if (filters.maxPrice !== undefined) chips.push({ key: "maxPrice", value: params.get("maxPrice")!, label: `До ${filters.maxPrice / 100} ₽` });
  if (filters.availableOnly) chips.push({ key: "available", value: "true", label: "Доступные в демо" });

  function navigate(next: URLSearchParams) {
    const url = new URL(window.location.href);
    url.search = next.toString();
    window.history.pushState(null, "", url);
  }
  function update(key: CatalogQueryKey, values: string[]) {
    navigate(updateCatalogQuery(new URLSearchParams(window.location.search), key, values));
  }
  function clear() { navigate(clearCatalogQuery(new URLSearchParams(window.location.search))); }

  return (
    <div className="catalog-browser">
      <div className="catalog-toolbar">
        <p className="catalog-count" role="status">Найдено: {visible.length}</p>
        <button ref={trigger} className="button-secondary filter-trigger" type="button" aria-expanded={open} onClick={() => setOpen(true)}>Фильтры{chips.length ? ` (${chips.length})` : ""}</button>
        <div className="sort-control"><label htmlFor={sortId}>Сортировка</label><CustomSelect id={sortId} label="Сортировка" value={filters.sort} onChange={(value) => update("sort", value === "recommended" ? [] : [value])} options={[{ value: "recommended", label: "Рекомендуемые" }, { value: "price-asc", label: "Цена по возрастанию" }, { value: "price-desc", label: "Цена по убыванию" }, { value: "newest", label: "Новинки коллекции" }]} /></div>
      </div>
      {chips.length > 0 && <div className="active-filters" aria-label="Выбранные фильтры">
        {chips.map((chip) => <button type="button" className="filter-chip" key={`${chip.key}-${chip.value}`} aria-label={`Убрать фильтр: ${chip.label}`} onClick={() => update(chip.key, params.getAll(chip.key).filter((value) => value !== chip.value))}>{chip.label}<span aria-hidden="true">×</span></button>)}
        <button type="button" className="text-button" onClick={clear}>Сбросить фильтры</button>
      </div>}
      <div className="catalog-layout">
        <section className="desktop-filters" aria-label="Фильтры каталога"><FilterControls params={params} update={update} /></section>
        <div className="catalog-results">
          {visible.length ? <ProductList products={visible} prioritizeFirst /> : <div className="quiet-panel"><h2>Букетов с такими параметрами нет</h2><p>Попробуйте другой выбор.</p><button type="button" className="button" onClick={clear}>Сбросить фильтры</button></div>}
        </div>
      </div>
      <ModalDialog open={open} title="Фильтры каталога" onClose={() => setOpen(false)} returnFocusRef={trigger}>
        <FilterControls params={params} update={update} />
        <div className="drawer-actions"><button type="button" className="text-button" onClick={clear}>Сбросить фильтры</button><button type="button" className="button" onClick={() => setOpen(false)}>Показать ({visible.length})</button></div>
      </ModalDialog>
    </div>
  );
}
