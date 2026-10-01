import { expect, it } from "vitest";
import { clearCatalogQuery, updateCatalogQuery } from "../../src/domain/catalog/query";

it("обновляет группу и сохраняет чужие параметры без мутации", () => {
  const original = new URLSearchParams("occasion=birthday&occasion=date&palette=light&campaign=portfolio");
  const next = updateCatalogQuery(original, "occasion", ["home"]);
  expect(next.getAll("occasion")).toEqual(["home"]);
  expect(next.get("palette")).toBe("light");
  expect(next.get("campaign")).toBe("portfolio");
  expect(original.getAll("occasion")).toEqual(["birthday", "date"]);
});

it("удаляет только выбранный фильтр и очищает только catalog params", () => {
  const original = new URLSearchParams("category=author&palette=light&minPrice=4000&maxPrice=7000&available=true&sort=price-asc&campaign=portfolio");
  const removed = updateCatalogQuery(original, "palette", []);
  expect(removed.has("palette")).toBe(false);
  expect(removed.get("minPrice")).toBe("4000");
  const cleared = clearCatalogQuery(original);
  expect(cleared.toString()).toBe("campaign=portfolio");
  expect(original.has("category")).toBe(true);
});
