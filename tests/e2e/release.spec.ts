import { expect, test, type Locator } from "@playwright/test";

test("release: каталог → товар → reload корзины → pickup demo без отправки данных", async ({ page }, testInfo) => {
  const activate = (control: Locator) => testInfo.project.use.hasTouch ? control.tap() : control.click();
  const errors: string[] = [];
  const submissions: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("request", (request) => { if (request.method() !== "GET") submissions.push(request.method() + " " + request.url()); });
  await page.goto("/shop");
  await activate(page.getByRole("combobox", { name: "Сортировка", exact: true }));
  await activate(page.getByRole("option", { name: "Цена по возрастанию", exact: true }));
  await expect(page.getByRole("combobox", { name: "Сортировка", exact: true })).toContainText("Цена по возрастанию");
  await expect(page).toHaveURL(/sort=price-asc/);
  await expect(page.getByRole("list", { name: "Букеты и композиции" }).getByRole("heading").first()).toHaveText("Белые тюльпаны");
  await page.getByRole("link", { name: /Авторский букет Первый свет/ }).click();
  await page.getByRole("radio", { name: /^M / }).check();
  await expect(page.getByRole("button", { name: "В корзину", exact: true })).toBeDisabled();
  await page.getByRole("radio", { name: /^S / }).check();
  await page.getByRole("button", { name: "В корзину", exact: true }).click();
  await page.getByRole("link", { name: "Перейти в корзину", exact: true }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByRole("region", { name: "Итог корзины" })).toContainText("4 900");
  await page.reload();
  await expect(page.getByRole("region", { name: "Итог корзины" })).toContainText("4 900");
  await page.getByRole("link", { name: "Демонстрационное оформление", exact: true }).click();
  await expect(page.getByRole("main")).toContainText("Заказ и оплата не выполняются");
  await page.getByRole("button", { name: "Завершить демонстрацию" }).click();
  await expect(page.getByRole("combobox", { name: "Дата", exact: true })).toBeFocused();
  await page.getByRole("radio", { name: /^Самовывоз/ }).check();
  await expect(page.getByLabel("Адрес", { exact: true })).toHaveCount(0);
  await activate(page.getByRole("combobox", { name: "Дата", exact: true }));
  await activate(page.getByRole("listbox", { name: "Дата", exact: true }).getByRole("option").first());
  await activate(page.getByRole("combobox", { name: "Интервал", exact: true }));
  await activate(page.getByRole("option", { name: "10:00–13:00", exact: true }));
  await page.getByLabel("Имя получателя", { exact: true }).fill("Demo recipient");
  await page.getByLabel("Телефон", { exact: true }).fill("79991234567");
  await page.getByRole("button", { name: "Завершить демонстрацию" }).click();
  await expect(page.getByRole("heading", { name: "Демонстрация завершена" })).toBeFocused();
  await expect(page.getByRole("region", { name: "Результат демонстрации" })).toContainText("4 900");
  expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual({ local: { "season-cart:v1": '{"version":1,"items":[]}' }, session: {} });
  expect(submissions).toEqual([]);
  expect(errors).toEqual([]);
});

test("release: mobile dialogs, metadata и deployment robots/sitemap", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop?sort=price-asc");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await expect(page.getByRole("dialog", { name: "Навигация" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Открыть меню" })).toBeFocused();
  await page.getByRole("button", { name: "Фильтры", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Фильтры каталога" });
  await dialog.getByRole("checkbox", { name: "День рождения", exact: true }).check();
  await dialog.getByRole("button", { name: /^Показать/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Убрать фильтр: День рождения" })).toBeVisible();
  const base = process.env.SITE_URL?.trim();
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Букеты — СЕЗОН");
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /Заказы и оплата не выполняются/);
  if (base) {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new URL("/shop", base).href);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", new URL("/images/flowers/hero.webp", base).href);
  } else {
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(base ? "Disallow: /checkout" : "Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect((await sitemap.text()).includes("<loc>")).toBe(Boolean(base));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
