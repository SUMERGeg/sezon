import { expect, test } from "@playwright/test";

test("базовые страницы доступны без ошибок и горизонтального overflow", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  for (const route of ["/", "/shop", "/cart", "/checkout", "/about", "/delivery-care"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toContainText("Заказы и оплата не выполняются");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (route === "/checkout") {
      await expect(page.getByRole("main")).toContainText("Заказ и оплата не выполняются");
      await expect(page.locator("input, textarea, form")).toHaveCount(0);
    }
    if (route === "/" || route === "/checkout") {
      await page.screenshot({ path: testInfo.outputPath(`${route === "/" ? "home" : "checkout"}.png`), fullPage: true });
    }
  }
  expect(errors).toEqual([]);
});

test("skip-link и переход к каталогу работают с клавиатуры; шрифты локальные", async ({ page }) => {
  const remoteRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== new URL(test.info().project.use.baseURL!).origin) remoteRequests.push(request.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('400 20px "Lora Variable"', "Цветы") && document.fonts.check('400 16px "Manrope Variable"', "Букеты"))).toBe(true);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "К содержимому" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Все букеты", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/shop$/);
  expect(remoteRequests).toEqual([]);
});

test("неизвестные страницы, товары и коллекции возвращают 404", async ({ page }) => {
  for (const route of ["/missing-page", "/shop/missing-product", "/collections/missing-collection"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Страница не найдена" })).toBeVisible();
    await expect(page.getByRole("link", { name: "На главную", exact: true })).toBeVisible();
  }
});
