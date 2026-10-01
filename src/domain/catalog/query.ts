export const catalogQueryKeys = ["category", "occasion", "palette", "minPrice", "maxPrice", "available", "sort"] as const;
export type CatalogQueryKey = typeof catalogQueryKeys[number];

export function updateCatalogQuery(source: URLSearchParams, key: CatalogQueryKey, values: readonly string[]) {
  const next = new URLSearchParams(source);
  next.delete(key);
  values.filter(Boolean).forEach((value) => next.append(key, value));
  return next;
}

export function clearCatalogQuery(source: URLSearchParams) {
  const next = new URLSearchParams(source);
  catalogQueryKeys.forEach((key) => next.delete(key));
  return next;
}
