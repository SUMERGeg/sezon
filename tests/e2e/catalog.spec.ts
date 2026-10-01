import { expect, test } from "@playwright/test";

test("каталог, товар и коллекция доступны с клавиатуры без ошибок и overflow", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/shop");
  const products = page.getByRole("list", { name: "Букеты и композиции" });
  await expect(products.getByRole("listitem")).toHaveCount(14);
  await expect(page.getByRole("main")).toContainText("Все цены и наличие — демонстрационные");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("catalog.png") });

  const firstProduct = products.getByRole("link").first();
  for (let index = 0; index < 60; index++) {
    await page.keyboard.press("Tab");
    if (await firstProduct.evaluate((element) => element === document.activeElement)) break;
  }
  await expect(firstProduct).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/shop\/first-light$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Первый свет");
  await expect(page).toHaveTitle("Первый свет — СЕЗОН");
  await page.getByRole("radio", { name: /^M / }).check();
  await expect(page.locator(".selected-price")).toContainText("6 300");
  await expect(page.getByRole("status", { name: "Доступность варианта" })).toContainText("Недоступен");
  await expect(page.locator(".product-photo")).toBeVisible();
  await expect.poll(() => page.locator(".product-photo").evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("product.png"), fullPage: true });

  const collection = page.getByRole("link", { name: "Утренний сад", exact: true });
  await collection.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/collections\/morning-garden$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Утренний сад");
  await expect(page.getByRole("list", { name: "Букеты и композиции" }).getByRole("listitem")).toHaveCount(7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("query фильтрует и сортирует каталог; пустое состояние позволяет вернуться", async ({ page }) => {
  await page.goto("/shop?occasion=birthday&palette=light&sort=price-asc");
  const products = page.getByRole("list", { name: "Букеты и композиции" });
  await expect(products.getByRole("listitem")).toHaveCount(1);
  await expect(products.getByRole("heading")).toHaveText("Первый свет");
  await page.goto("/shop?sort=price-asc&category=unknown");
  await expect(products.getByRole("listitem")).toHaveCount(14);
  await expect(products.getByRole("heading").first()).toHaveText("Белые тюльпаны");
  await page.goto("/shop?minPrice=999999");
  await expect(page.getByRole("heading", { name: "Букетов с такими параметрами нет" })).toBeVisible();
  await page.getByRole("button", { name: "Сбросить фильтры", exact: true }).last().click();
  await expect(products.getByRole("listitem")).toHaveCount(14);
});
