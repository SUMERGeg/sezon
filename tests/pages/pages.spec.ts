import { expect, test, type Locator, type Page } from "@playwright/test";
import { catalog } from "../../src/data/catalog";

const prefix = (process.env.PAGES_BASE_PATH || "").replace(/\/$/, "");
async function tabTo(page: Page, target: Locator) {
  for (let count = 0; count < 80; count++) {
    if (await target.evaluate(element => element === document.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  throw new Error(`Не найден клавиатурный фокус: ${await target.textContent()}`);
}
function monitor(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
  return errors;
}

test("Pages: все маршруты, responsive изображения/декор и metadata без runtime сервера", async ({ page, request }, testInfo) => {
  const errors = monitor(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["", "shop/", "about/", "delivery-care/", "cart/", "checkout/", ...catalog.products.map(product => `shop/${product.slug}/`), ...catalog.collections.map(collection => `collections/${collection.slug}/`)]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(await response.text(), path).toContain("<html");
  }
  const html = await (await request.get("shop/")).text();
  for (const product of catalog.products) expect(html).toContain(product.name);
  await page.goto("./");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("main img").first()).toBeVisible();
  await expect.poll(() => page.locator("main img").first().evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(await page.locator("main img").first().getAttribute("srcset")).toContain(`${prefix}/images/static/flowers/`);
  for (const target of [".home-collections", ".final-cta"]) {
    await page.locator(target).scrollIntoViewIfNeeded();
    const background = await page.locator(target).evaluate(element => getComputedStyle(element, "::after").backgroundImage);
    expect(background).toContain(`${prefix}/images/static/decor/`);
    const urls = [...background.matchAll(/url\("?([^"\)]+)"?\)/g)].map(match => match[1]);
    for (const url of urls) expect((await request.get(url)).status()).toBe(200);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("static-home.png") });
  await page.goto("shop/first-light/");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Первый свет");
  const origin = process.env.SITE_URL;
  if (origin) {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${origin}${prefix}/shop/first-light/`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${origin}${prefix}/images/flowers/hero.webp`);
    expect(await (await request.get("sitemap.xml")).text()).toContain(`${origin}${prefix}/shop/first-light/`);
    expect(await (await request.get("robots.txt")).text()).toContain(`Disallow: ${prefix}/checkout`);
  }
  expect(await page.evaluate(() => performance.getEntriesByType("resource").some(entry => entry.name.includes("/_next/image?")))).toBe(false);
  expect(errors).toEqual([]);
});

test("Pages: URL-фильтры, сортировка, history/reload и мобильные диалоги", async ({ page }) => {
  const errors = monitor(page);
  await page.goto("shop/?sort=price-asc");
  const sort = page.getByRole("combobox", { name: "Сортировка", exact: true });
  await expect(sort).toContainText("Цена по возрастанию");
  await expect(page.getByRole("list", { name: "Букеты и композиции" }).getByRole("heading").first()).toHaveText("Белые тюльпаны");
  await sort.focus();
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(sort).toContainText("Новинки коллекции");
  await page.goBack();
  await expect(sort).toContainText("Цена по возрастанию");
  await page.reload();
  await expect(sort).toContainText("Цена по возрастанию");
  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.getByRole("button", { name: "Открыть меню" });
  await menu.click();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await page.getByRole("button", { name: "Фильтры", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Фильтры каталога" });
  await dialog.getByRole("checkbox", { name: "День рождения", exact: true }).check();
  await dialog.getByRole("button", { name: /^Показать/ }).click();
  await expect(page.getByRole("button", { name: "Убрать фильтр: День рождения" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Убрать фильтр: День рождения" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("Pages: keyboard товар → cart reload → demo-checkout без сохранения/отправки контактов", async ({ page }) => {
  const errors = monitor(page);
  const submissions: string[] = [];
  page.on("request", request => { if (!["GET", "HEAD"].includes(request.method())) submissions.push(request.url()); });
  await page.goto("shop/first-light/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "К содержимому" })).toBeFocused();
  await page.keyboard.press("Enter");
  await tabTo(page, page.getByRole("button", { name: "Следующее фото" }));
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status", { name: "Номер фотографии" })).toHaveText("2 / 3");
  await tabTo(page, page.getByRole("radio", { name: /^S / }));
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("button", { name: "В корзину", exact: true })).toBeDisabled();
  await page.keyboard.press("ArrowLeft");
  await tabTo(page, page.getByRole("button", { name: "В корзину", exact: true }));
  await page.keyboard.press("Enter");
  await tabTo(page, page.getByRole("link", { name: "Перейти в корзину", exact: true }));
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${prefix}/cart/$`));
  await expect(page.getByRole("region", { name: "Итог корзины" })).toContainText("4 900");
  await page.reload();
  await expect(page.getByRole("region", { name: "Итог корзины" })).toContainText("4 900");
  await tabTo(page, page.getByRole("link", { name: "Демонстрационное оформление", exact: true }));
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${prefix}/checkout/$`));
  await page.reload();
  await expect(page.getByRole("form")).toBeVisible();
  const finish = page.getByRole("button", { name: "Завершить демонстрацию" });
  await tabTo(page, finish);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("combobox", { name: "Дата", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("combobox", { name: "Интервал", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Имя получателя", { exact: true })).toBeFocused();
  await page.keyboard.type("Demo recipient");
  await page.keyboard.press("Tab");
  await page.keyboard.type("79991234567");
  await tabTo(page, page.getByLabel("Адрес", { exact: true }));
  await page.keyboard.type("Demo address");
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage }))).not.toContain("Demo");
  await tabTo(page, finish);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Демонстрация завершена" })).toBeFocused();
  expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual({ local: { "season-cart:v1": '{"version":1,"items":[]}' }, session: {} });
  expect(submissions).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
