import { expect, test } from "@playwright/test";

test("M6: секции появляются один раз без изменения размеров; focus не скрыт", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const final = page.locator(".final-cta");
  await expect(final).toHaveAttribute("data-reveal", "pending");
  expect(await page.locator(".home-intro").evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
  const dimensions = await final.evaluate((element) => [element.clientWidth, element.clientHeight, document.documentElement.scrollHeight]);
  await final.scrollIntoViewIfNeeded();
  await expect(final).toHaveAttribute("data-reveal", "visible");
  await final.evaluate(async (element) => { await Promise.all(element.getAnimations().map((animation) => animation.finished)); });
  expect(await final.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
  expect(await final.evaluate((element) => [element.clientWidth, element.clientHeight, document.documentElement.scrollHeight])).toEqual(dimensions);
  await page.evaluate(() => window.scrollTo(0, 0));
  await final.scrollIntoViewIfNeeded();
  expect(await final.evaluate((element) => element.getAnimations().length)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("home-final.png") });
  await final.getByRole("link", { name: "Перейти к букетам", exact: true }).focus();
  await page.keyboard.press("Tab");
  expect(await final.evaluate((element) => element.getAnimations().length)).toBe(0);
  await page.reload();
  await page.evaluate(() => window.scrollTo(0, 0));
  // A fresh route makes the last section pending again before focus enters it.
  await page.goto("/shop");
  await page.goto("/");
  await expect(final).toHaveAttribute("data-reveal", "pending");
  await final.getByRole("link", { name: "Перейти к букетам", exact: true }).focus();
  await expect(final.getByRole("link", { name: "Перейти к букетам", exact: true })).toBeFocused();
  expect(await final.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
  expect(await final.evaluate((element) => getComputedStyle(element).transform)).toBe("none");
  await page.keyboard.press("Tab");
  expect(await final.evaluate((element) => element.getAnimations().length)).toBe(0);
});

test("M6: reduced motion и изменение настройки оставляют весь контент видимым", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".final-cta")).toHaveAttribute("data-reveal", "pending");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator('[data-reveal="pending"]')).toHaveCount(0);
  for (const section of await page.locator("[data-reveal]").all()) {
    expect(await section.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    expect(await section.evaluate((element) => element.getAnimations().length)).toBe(0);
  }
  await page.goto("/shop");
  const card = page.locator(".product-card").first();
  await card.hover();
  expect(await card.locator("img").evaluate((element) => getComputedStyle(element).transform)).toBe("none");
  await page.getByRole("combobox", { name: "Сортировка", exact: true }).click();
  expect(await page.getByRole("listbox").evaluate((element) => element.getAnimations().length)).toBe(0);
});

test("M6: главная полностью видима без JavaScript", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  await page.goto(`${testInfo.project.use.baseURL}/`);
  await expect(page.getByRole("heading", { name: "Найдите свой букет." })).toBeVisible();
  expect(await page.locator('[data-reveal="pending"]').count()).toBe(0);
  expect(await page.locator(".final-cta").evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
  await page.getByRole("link", { name: "Все букеты", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Букеты и композиции", exact: true })).toBeVisible();
  await context.close();
});

test("M6: карточка реагирует на hover/focus, сохраняя геометрию", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/shop");
  const card = page.locator(".product-card").first();
  const image = card.locator("img");
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  const bounds = await card.boundingBox();
  await card.hover();
  await expect.poll(() => image.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  expect(await card.locator(".product-card-media").evaluate((element) => getComputedStyle(element).overflow)).toBe("hidden");
  expect(await card.boundingBox()).toEqual(bounds);
  await card.focus();
  await expect(card).toBeFocused();
  expect(await card.locator("h2").evaluate((element) => getComputedStyle(element).textDecorationLine)).toContain("underline");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("catalog-focus.png") });
});
