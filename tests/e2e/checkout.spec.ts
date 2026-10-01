import { expect, test, type Page } from "@playwright/test";

async function startCheckout(page: Page, withCard = false) {
  await page.goto("/shop/first-light");
  if (withCard) await page.getByRole("checkbox", { name: "Добавить открытку" }).check();
  await page.getByRole("button", { name: "В корзину", exact: true }).click();
  await page.getByRole("link", { name: "Перейти в корзину", exact: true }).click();
  await page.getByRole("link", { name: "Демонстрационное оформление", exact: true }).click();
  await expect(page.getByRole("form", { name: "Демонстрационное оформление" })).toBeVisible();
}

async function fillBasics(page: Page) {
  await page.getByRole("combobox", { name: "Дата", exact: true }).click();
  await page.getByRole("listbox", { name: "Дата", exact: true }).getByRole("option").first().click();
  await page.getByRole("combobox", { name: "Интервал", exact: true }).click();
  await page.getByRole("option", { name: "10:00–13:00", exact: true }).click();
  await page.getByLabel("Имя получателя", { exact: true }).fill("Тестовый получатель");
  await page.getByLabel("Телефон", { exact: true }).fill("+7 (999) 123-45-67");
}

test("курьер: ошибки, keyboard completion, итог и отсутствие сохранения/отправки контактов", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await startCheckout(page, true);
  await expect(page.getByRole("region", { name: "Итог оформления" })).toContainText("5 400");
  await page.getByRole("button", { name: "Завершить демонстрацию" }).click();
  await expect(page.getByLabel("Дата", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Дата", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("form", { name: "Демонстрационное оформление" }).getByRole("alert")).toContainText("Проверьте");
  await fillBasics(page);
  await page.getByLabel("Адрес", { exact: true }).fill("Пример адреса, дом 1");
  await page.getByLabel(/^Email/).fill("demo@example.com");
  await page.getByLabel(/^Текст открытки/).fill("Тестовая открытка");
  await page.getByLabel(/^Комментарий/).fill("Пример комментария");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("checkout.png"), fullPage: true });
  const submissions: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET" || /Тестовый|demo%40|demo@example|Пример|79991234567/.test(request.url() + (request.postData() ?? ""))) submissions.push(request.method() + " " + request.url());
  });
  const finish = page.getByRole("button", { name: "Завершить демонстрацию" });
  await finish.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Демонстрация завершена" })).toBeFocused();
  await expect(page.getByRole("region", { name: "Результат демонстрации" })).toContainText("5 400");
  await expect(page.getByRole("main")).not.toContainText("Тестовый получатель");
  await expect(page.getByRole("main")).not.toContainText("Пример адреса");
  await expect(page.getByRole("banner").getByRole("link", { name: "Корзина (0)" })).toBeVisible();
  const storage = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
  expect(storage.local).toEqual({ "season-cart:v1": '{"version":1,"items":[]}' });
  expect(storage.session).toEqual({});
  expect(submissions).toEqual([]);
  expect(errors).toEqual([]);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Сначала выберите букет" })).toBeVisible();
});

test("самовывоз: адрес скрыт, доставка бесплатна, незавершённая форма не сохраняется", async ({ page }) => {
  await startCheckout(page);
  await page.getByLabel("Адрес", { exact: true }).fill("Пример адреса");
  await page.getByRole("radio", { name: /^Самовывоз/ }).check();
  await expect(page.getByLabel("Адрес", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel(/^Текст открытки/)).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Итог оформления" })).toContainText("4 900");
  await fillBasics(page);
  await page.getByLabel(/^Комментарий/).fill("Не сохранять");
  await page.getByRole("form", { name: "Демонстрационное оформление" }).getByRole("link", { name: "Вернуться в корзину" }).click();
  await page.getByRole("link", { name: "Демонстрационное оформление", exact: true }).click();
  await expect(page.getByLabel("Имя получателя", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Телефон", { exact: true })).toHaveValue("");
  await expect(page.getByLabel(/^Комментарий/)).toHaveValue("");
  await fillBasics(page);
  await page.reload();
  await expect(page.getByLabel("Имя получателя", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Телефон", { exact: true })).toHaveValue("");
  await expect(page.getByLabel(/^Комментарий/)).toHaveValue("");
  await expect(page.getByRole("banner").getByRole("link", { name: "Корзина (1)" })).toBeVisible();
  await page.getByRole("radio", { name: /^Самовывоз/ }).check();
  await fillBasics(page);
  await page.getByRole("button", { name: "Завершить демонстрацию" }).click();
  await expect(page.getByRole("heading", { name: "Демонстрация завершена" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Результат демонстрации" })).toContainText("4 900");
});

test("пустая/изменённая корзина и отключённый интервал не допускают завершения", async ({ page, context }) => {
  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: "Сначала выберите букет" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Завершить демонстрацию" })).toHaveCount(0);
  await startCheckout(page);
  await page.getByRole("combobox", { name: "Интервал", exact: true }).click();
  await expect(page.getByRole("option", { name: "16:00–19:00 — недоступен в примере" })).toHaveAttribute("aria-disabled", "true");
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("combobox", { name: "Интервал", exact: true })).toContainText("13:00–16:00");
  await fillBasics(page);
  await page.getByLabel("Адрес", { exact: true }).fill("Пример адреса, дом 1");
  const other = await context.newPage();
  await other.goto("/cart");
  await other.getByRole("button", { name: /^Увеличить/ }).click();
  await expect(page.getByRole("region", { name: "Итог оформления" })).toContainText("10 300");
  await other.getByRole("button", { name: /^Удалить/ }).click();
  await expect(page.getByRole("heading", { name: "Сначала выберите букет" })).toBeVisible();
  await expect(page.getByRole("form", { name: "Демонстрационное оформление" })).toHaveCount(0);
  await other.close();
});
