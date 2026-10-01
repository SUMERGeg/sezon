import { expect, test } from "@playwright/test";

test("добавление с клавиатуры, merge/опции, reload и управление корзиной", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/shop/first-light");
  const add = page.getByRole("button", { name: "В корзину", exact: true });
  await expect(add).toBeEnabled();
  await add.focus();
  await page.keyboard.press("Enter");
  await expect(add).toBeFocused();
  await expect(page.getByRole("status", { name: "Добавление в корзину" })).toContainText("добавлен");
  await page.keyboard.press("Enter");
  await page.getByRole("checkbox", { name: "Добавить открытку" }).check();
  await add.click();
  await page.getByRole("radio", { name: /^L / }).check();
  await add.click();
  await expect(page.getByRole("banner").getByRole("link", { name: "Корзина (4)" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("banner").getByRole("link", { name: "Корзина (4)" })).toBeVisible();
  await page.getByRole("banner").getByRole("link", { name: "Корзина (4)" }).click();
  const lines = page.getByRole("list", { name: "Букеты в корзине" }).getByRole("listitem");
  await expect(lines).toHaveCount(3);
  await expect(page.getByRole("region", { name: "Итог корзины" })).toContainText("22 800");
  const first = lines.first();
  await first.getByRole("button", { name: /^Увеличить/ }).focus();
  await page.keyboard.press("Enter");
  await expect(first.getByRole("status", { name: "Количество" })).toHaveText("3");
  await expect(page.getByRole("region", { name: "Итог корзины" })).toContainText("27 700");
  await first.getByRole("button", { name: /^Уменьшить/ }).click();
  await first.getByRole("button", { name: /^Уменьшить/ }).click();
  await expect(first.getByRole("button", { name: /^Уменьшить/ })).toBeDisabled();
  for (let i = 0; i < 4; i++) await first.getByRole("button", { name: /^Увеличить/ }).click();
  await expect(first.getByRole("button", { name: /^Увеличить/ })).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("cart.png"), fullPage: true });
  await first.getByRole("button", { name: /^Удалить/ }).focus();
  await page.keyboard.press("Enter");
  await expect(lines).toHaveCount(2);
  await expect(lines.first().getByRole("button", { name: /^Удалить/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Пока здесь нет букетов" })).toBeFocused();
  await expect(page.getByRole("link", { name: "Перейти к букетам", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Пока здесь нет букетов" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("повреждённая и устаревшая storage не ломает корзину и не подменяет цены", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.getByRole("banner").getByRole("link", { name: "Корзина (0)" })).toBeVisible();
  await page.evaluate(() => localStorage.setItem("season-cart:v1", "{broken"));
  await page.reload();
  await expect(page.getByRole("heading", { name: "Пока здесь нет букетов" })).toBeVisible();
  await expect(page.getByRole("status", { name: "Состояние корзины" })).toContainText("обновлена");
  await page.evaluate(() => localStorage.setItem("season-cart:v1", JSON.stringify({ version: 1, items: [
    { productId: "first-light", variantId: "first-light-s", quantity: 99, greetingCard: false, price: 1, phone: "private" },
    { productId: "first-light", variantId: "first-light-m", quantity: 1, greetingCard: false },
    { productId: "missing", variantId: "missing", quantity: 1, greetingCard: false },
  ] })));
  await page.reload();
  await expect(page.getByRole("list", { name: "Букеты в корзине" }).getByRole("listitem")).toHaveCount(1);
  await expect(page.getByRole("region", { name: "Итог корзины" })).toContainText("24 500");
  await expect(page.getByRole("button", { name: /^Увеличить/ })).toBeDisabled();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("season-cart:v1")!))).toEqual({ version: 1, items: [{ productId: "first-light", variantId: "first-light-s", quantity: 5, greetingCard: false }] });
});

test("запрет storage сохраняет работу корзины в текущей вкладке", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } }); });
  await page.goto("/shop/first-light");
  await page.getByRole("button", { name: "В корзину", exact: true }).click();
  await page.getByRole("link", { name: "Перейти в корзину", exact: true }).click();
  await expect(page.getByRole("list", { name: "Букеты в корзине" }).getByRole("listitem")).toHaveCount(1);
  await expect(page.getByRole("status", { name: "Состояние корзины" })).toContainText("текущей вкладке");
});

test("изменения корзины синхронизируются между вкладками", async ({ page, context }) => {
  await page.goto("/cart");
  const other = await context.newPage();
  await other.goto("/shop/first-light");
  await other.getByRole("button", { name: "В корзину", exact: true }).click();
  await expect(page.getByRole("list", { name: "Букеты в корзине" }).getByRole("listitem")).toHaveCount(1);
  await page.getByRole("button", { name: /^Удалить/ }).click();
  await expect(other.getByRole("banner").getByRole("link", { name: "Корзина (0)" })).toBeVisible();
  await other.close();
});
